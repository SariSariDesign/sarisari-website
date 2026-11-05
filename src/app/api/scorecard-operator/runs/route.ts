import { NextResponse } from "next/server";
import { z } from "zod";
import { operatorAuthorized } from "@/lib/scorecard/operatorAuth";
import { createOperatorRun } from "@/lib/scorecard/pipeline";
import { getEvidenceStore, getStore } from "@/lib/scorecard/store.supabase";
import { scoreOf, bandOfReport } from "@/lib/scorecard/report";

/**
 * Operator kickoff: POST a reviewed preview draft plus its redacted evidence
 * images. The run is stored as pending_approval, reviewable at /s/<slug>, and a
 * review copy of the prospect email goes to admin. Nothing reaches the prospect
 * until /api/scorecard-operator/runs/<slug>/approve is called.
 *
 * GET ?since=YYYY-MM-DD lists runs (both kickoff paths) for calibration review.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 2_000_000;

const bodySchema = z.object({
  by: z.string().min(1),
  lead: z.object({
    name: z.string().min(1),
    company: z.string().min(1),
    email: z.string().email(),
    stage: z.string().min(1),
    url: z.string().url(),
  }),
  draft: z.record(z.string(), z.unknown()),
  internal: z.record(z.string(), z.unknown()).default({}),
  images: z
    .array(
      z.object({
        key: z.string().regex(/^[a-z0-9-]+\.(png|jpe?g|webp)$/),
        contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
        base64: z.string().min(1),
        redactionReviewed: z.literal(true),
      }),
    )
    .max(5)
    .default([]),
});

export async function POST(req: Request) {
  if (!operatorAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "invalid body", detail: String(err).slice(0, 2000) }, { status: 400 });
  }
  const { lead, images } = parsed;
  const domain = new URL(lead.url).hostname.replace(/^www\./i, "");
  const draft = parsed.draft as Parameters<typeof createOperatorRun>[0]["draft"];

  // Every image a finding references must be supplied, and nothing extra.
  const referenced = new Set(
    ((draft.findings ?? []) as Array<{ image: { key: string } | null }>).flatMap((f) => (f.image ? [f.image.key] : [])),
  );
  const supplied = new Set(images.map((i) => i.key));
  const missing = [...referenced].filter((k) => !supplied.has(k));
  const extra = [...supplied].filter((k) => !referenced.has(k));
  if (missing.length || extra.length) {
    return NextResponse.json({ error: "image mismatch", missing, extra }, { status: 400 });
  }
  const decoded = images.map((i) => ({ ...i, bytes: Buffer.from(i.base64, "base64") }));
  const big = decoded.find((i) => i.bytes.length > MAX_IMAGE_BYTES);
  if (big) return NextResponse.json({ error: `image ${big.key} exceeds ${MAX_IMAGE_BYTES} bytes` }, { status: 400 });

  try {
    const { row, reportUrl, reviewEmailId } = await createOperatorRun({
      lead: { ...lead, domain },
      draft,
      internal: parsed.internal,
      by: parsed.by,
    });
    const evidence = getEvidenceStore();
    for (const img of decoded) await evidence.put(row.slug, img.key, new Uint8Array(img.bytes), img.contentType);
    const { score, bandName } = scoreOf(row.result);
    return NextResponse.json({
      status: row.status,
      slug: row.slug,
      url: reportUrl,
      score,
      band: bandName,
      rubricVersion: row.rubricVersion,
      reviewEmailId,
    });
  } catch (err) {
    return NextResponse.json({ error: "run failed", detail: String(err).slice(0, 2000) }, { status: 422 });
  }
}

export async function GET(req: Request) {
  if (!operatorAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const since = new URL(req.url).searchParams.get("since") ?? "1970-01-01";
  const rows = await getStore().listSince(since);
  return NextResponse.json({
    runs: rows.map((r) => ({
      slug: r.slug,
      company: r.company,
      url: r.url,
      kickoff: r.kickoff,
      status: r.status,
      rubricVersion: r.rubricVersion,
      createdAt: r.createdAt,
      sentAt: r.sentAt,
      lastError: r.lastError,
      score: r.status === "failed" && r.overallScore === 0 ? null : r.overallScore,
      band: bandOfReport(r.result),
      reviewEvents: r.reviewEvents,
      internal: r.internal,
      result: r.result,
    })),
  });
}
