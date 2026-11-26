import { NextResponse } from "next/server";
import { getStore } from "@/lib/scorecard/store.supabase";

/**
 * Daily keep-alive for the website's Supabase project.
 *
 * Supabase pauses a free-tier project after 7 days with no activity, which
 * takes the Scorecard Preview store offline until someone restores it by hand.
 * Vercel Cron calls this route once a day (see `crons` in vercel.json) and the
 * route does one tiny fixed read, which counts as activity.
 *
 * This route has no auth: the repo has no CRON_SECRET today, and adding an env
 * var is a separate decision. It is safe to call by anyone because it takes no
 * input, runs one fixed read, never writes, and returns only ok true/false. If
 * CRON_SECRET is added later, check `Authorization: Bearer <CRON_SECRET>` here.
 *
 * To stop the job: remove the cron entry from vercel.json, or disable it in the
 * Vercel project under Settings > Cron Jobs.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    await getStore().ping();
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    // The reason goes to the server log only. The response stays generic, and a
    // non-200 status marks the run as failed in Vercel's cron logs.
    console.error("[supabase-keepalive] read failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ ok: false, error: "keepalive_failed" }, { status: 503, headers: NO_STORE });
  }
}
