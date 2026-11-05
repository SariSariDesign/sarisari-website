import { getEvidenceStore, getStore } from "@/lib/scorecard/store.supabase";
import { isPreviewReport } from "@/lib/scorecard/report";

/**
 * Serves a report's redacted evidence image from the private bucket. Only keys
 * that the stored report actually references are served, so nothing else in the
 * bucket is reachable by guessing.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; key: string }> }) {
  const { slug, key } = await params;
  const row = await getStore().getBySlug(slug);
  if (!row || !isPreviewReport(row.result) || !row.result.findings.some((f) => f.image?.key === key)) {
    return new Response("Not found", { status: 404 });
  }
  const file = await getEvidenceStore().get(slug, key);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
