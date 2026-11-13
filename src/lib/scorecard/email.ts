import type { PreviewReport } from "./types";
import type { LegacyScorecardResult } from "./legacy-types";
import type { ScorecardLead } from "./pipeline";
import { findingTitles, scoreOf } from "./report";
import { countWord } from "./count";

type AnyResult = PreviewReport | LegacyScorecardResult;

/**
 * Emails the lead a short, branded "your scorecard is ready" note with a link to
 * the hosted report page (/s/<slug>). The full report is a real web page — the
 * email stays deliberately minimal so it renders cleanly in every mail client.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Warm-gray + blue tokens (mirror the report design). Inlined because email
// clients strip <style>.
const C = {
  bg: "#F7F5F0",
  card: "#ffffff",
  border: "#e6e5e4",
  ink: "#1f1d1c",
  body: "#575452",
  muted: "#8a8884",
  primary: "#1f5fa6",
  primarySoft: "#e8f0fa",
};

/**
 * `reportUrl` is threaded through `opts` (rather than as its own positional
 * param) so both call sites can pass just the fields they have — the pipeline
 * always has a reportUrl but not always a delta, tests need neither.
 */
export type ScorecardEmailOpts = { reportUrl?: string; delta?: number | null };

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderScorecardEmailHtml(
  lead: ScorecardLead,
  result: AnyResult,
  opts: ScorecardEmailOpts = {},
): string {
  const firstName = lead.name.split(" ")[0] || lead.name;
  const href = esc(opts.reportUrl ?? "");

  const { score, bandName } = scoreOf(result);
  const findings = findingTitles(result)
    .map((t) => `<li style="margin:0 0 8px;">${esc(t)}</li>`)
    .join("");
  const what = "format" in result && result.source === "recording" ? "the first-run recording of " : "";
  const n = findingTitles(result).length;
  // Fewer than five: say so plainly, and tell them a person will follow up.
  const intro =
    n >= 5
      ? "Here are the five findings that matter most."
      : `Our AI review found ${countWord(n)} ${n === 1 ? "issue" : "issues"} it could back with clear evidence. The rest of what it checked meets most best practices.`;
  const fewNote =
    n < 5
      ? `<div style="background:${C.primarySoft};border-radius:8px;padding:12px 16px;margin:0 0 24px;font-size:14px;line-height:1.55;color:${C.ink};">
         <strong>What happens next:</strong> automated reviews can miss things, so a designer on our team will look at your page and follow up by email.
       </div>`
      : "";

  const improved = opts.delta != null && opts.delta > 0;
  const deltaBanner = improved
    ? `<div style="background:${C.primarySoft};border-radius:10px;padding:10px 14px;margin-bottom:20px;font-size:13px;color:${C.primary};">
         Your score improved from ${score - (opts.delta as number)} to ${score} since your last check.
       </div>`
    : "";

  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.bg};">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;font-family:'Helvetica Neue',Arial,sans-serif;color:${C.body};">
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:32px;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.primary};">Activation Scorecard</div>
      <h1 style="font-size:24px;line-height:1.25;color:${C.ink};margin:10px 0 14px;">Hi ${esc(firstName)}, your scorecard preview is ready</h1>
      <p style="font-size:15px;line-height:1.6;color:${C.body};margin:0 0 8px;">
        We scored ${what}<strong style="color:${C.ink};">${esc(lead.company)}</strong> against our activation rubric. ${intro}
      </p>
      <p style="font-size:15px;line-height:1.6;color:${C.body};margin:0 0 24px;">
        Your Preview Score is <strong style="color:${C.primary};">${score}/100</strong>: ${esc(bandName)}.
      </p>
      ${deltaBanner}
      <ul style="font-size:14px;line-height:1.6;color:${C.body};margin:0 0 24px;padding-left:18px;">
        ${findings}
      </ul>
      ${fewNote}

      <a href="${href}" style="display:inline-block;background:${C.primary};color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:14px 28px;border-radius:6px;">View your scorecard preview</a>

      <p style="font-size:13px;line-height:1.6;color:${C.muted};margin:24px 0 0;">
        Or paste this link into your browser:<br>
        <a href="${href}" style="color:${C.primary};word-break:break-all;">${href}</a>
      </p>
    </div>

    <p style="font-size:11px;color:${C.muted};text-align:center;margin:20px 0 0;">SariSari Design LLC &middot;
      <a href="https://www.sarisari.design/privacy" style="color:${C.muted};">Privacy</a> &middot;
      <a href="https://www.sarisari.design/terms" style="color:${C.muted};">Terms</a>
    </p>
  </div>
  </body></html>`;
}

/**
 * Sent when the automated review could not read the submitted page (blocked,
 * behind a login, timed out) or found nothing it could back with evidence.
 * Same look as the scorecard email. No report link: there is no report.
 * Replies go to the team inbox so the lead can send a different link.
 */
export function renderUnreadableEmailHtml(lead: ScorecardLead): string {
  const firstName = lead.name.split(" ")[0] || lead.name;
  const url = esc(lead.url);
  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.bg};">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;font-family:'Helvetica Neue',Arial,sans-serif;color:${C.body};">
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:32px;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.primary};">Activation Scorecard</div>
      <h1 style="font-size:24px;line-height:1.25;color:${C.ink};margin:10px 0 14px;">Hi ${esc(firstName)}, we couldn't read your page</h1>
      <p style="font-size:15px;line-height:1.6;color:${C.body};margin:0 0 8px;">
        Our automated review couldn't read <a href="${url}" style="color:${C.primary};overflow-wrap:anywhere;">${url}</a> for technical reasons, so we weren't able to score <strong style="color:${C.ink};">${esc(lead.company)}</strong> yet.
      </p>
      <p style="font-size:15px;line-height:1.6;color:${C.body};margin:0 0 24px;">
        This usually happens when a page blocks automated tools, sits behind a login, or takes too long to load. It says nothing about the quality of your site.
      </p>
      <div style="background:${C.primarySoft};border-radius:8px;padding:12px 16px;margin:0 0 24px;font-size:14px;line-height:1.55;color:${C.ink};">
        <strong>What happens next:</strong> a designer on our team will look at your page and follow up by email.
      </div>
      <p style="font-size:14px;line-height:1.6;color:${C.body};margin:0;">
        Want us to check a different page? Reply to this email with the link.
      </p>
    </div>

    <p style="font-size:11px;color:${C.muted};text-align:center;margin:20px 0 0;">SariSari Design LLC &middot;
      <a href="https://www.sarisari.design/privacy" style="color:${C.muted};">Privacy</a> &middot;
      <a href="https://www.sarisari.design/terms" style="color:${C.muted};">Terms</a>
    </p>
  </div>
  </body></html>`;
}

export async function sendUnreadableEmail(lead: ScorecardLead, replyTo: string): Promise<{ id: string | null }> {
  return postToResend({
    to: [lead.email],
    reply_to: replyTo,
    subject: "Your Activation Scorecard: we couldn't read your page",
    html: renderUnreadableEmailHtml(lead),
  });
}

async function postToResend(payload: { to: string[]; subject: string; html: string; reply_to?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const from = process.env.RESEND_FROM ?? "Sari Sari Design <scorecard@sarisari.design>";
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...payload }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed: ${res.status} ${detail}`);
  }
  const json = (await Promise.resolve()
    .then(() => res.json())
    .catch(() => ({}))) as { id?: string };
  return { id: json.id ?? null };
}

export async function sendScorecardEmail(
  lead: ScorecardLead,
  result: AnyResult,
  opts: ScorecardEmailOpts & { to?: string; subjectPrefix?: string } = {},
): Promise<{ id: string | null }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const from = process.env.RESEND_FROM ?? "Sari Sari Design <scorecard@sarisari.design>";
  const html = renderScorecardEmailHtml(lead, result, opts);

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to ?? lead.email],
      subject: `${opts.subjectPrefix ?? ""}Your Activation Scorecard Preview: ${scoreOf(result).score}/100`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed: ${res.status} ${detail}`);
  }
  const json = (await Promise.resolve()
    .then(() => res.json())
    .catch(() => ({}))) as { id?: string };
  return { id: json.id ?? null };
}
