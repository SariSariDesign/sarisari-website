import { NextResponse } from "next/server";
import { z } from "zod";
import { operatorAuthorized } from "@/lib/scorecard/operatorAuth";
import { reviseOperatorRun } from "@/lib/scorecard/pipeline";
import { getStore } from "@/lib/scorecard/store.supabase";
import { scoreOf } from "@/lib/scorecard/report";

/** GET a run's full record; PATCH replaces a held run's report and logs the revision. */
export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, { params }: Ctx) {
  if (!operatorAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  const row = await getStore().getBySlug(slug);
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(row);
}

const patchSchema = z.object({
  by: z.string().min(1),
  reason: z.string().min(1),
  changes: z.array(z.string().min(1)).min(1),
  draft: z.record(z.string(), z.unknown()),
  internal: z.record(z.string(), z.unknown()).optional(),
});

export async function PATCH(req: Request, { params }: Ctx) {
  if (!operatorAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  try {
    const body = patchSchema.parse(await req.json());
    const row = await reviseOperatorRun(slug, {
      ...body,
      draft: body.draft as Parameters<typeof reviseOperatorRun>[1]["draft"],
    });
    return NextResponse.json({ status: row.status, slug, ...scoreOf(row.result) });
  } catch (err) {
    return NextResponse.json({ error: "revise failed", detail: String(err).slice(0, 2000) }, { status: 422 });
  }
}
