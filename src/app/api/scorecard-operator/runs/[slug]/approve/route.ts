import { NextResponse } from "next/server";
import { z } from "zod";
import { operatorAuthorized } from "@/lib/scorecard/operatorAuth";
import { approveAndSend, reportUrlFor } from "@/lib/scorecard/pipeline";

/**
 * Release a held operator run to the prospect. Call only after the founder has
 * approved this specific report and recipient. `confirmSlug` must repeat the
 * slug so a wrong or replayed call cannot send a different report.
 */
export const runtime = "nodejs";

const schema = z.object({ approvedBy: z.string().min(1), confirmSlug: z.string().min(1), note: z.string().optional() });

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!operatorAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "invalid body", detail: String(err) }, { status: 400 });
  }
  if (body.confirmSlug !== slug) return NextResponse.json({ error: "confirmSlug does not match" }, { status: 400 });
  try {
    const { row, emailId } = await approveAndSend(slug, body);
    return NextResponse.json({ status: row.status, slug, url: reportUrlFor(slug), sentTo: row.email, sentAt: row.sentAt, emailId });
  } catch (err) {
    return NextResponse.json({ error: "send failed", detail: String(err).slice(0, 2000) }, { status: 409 });
  }
}
