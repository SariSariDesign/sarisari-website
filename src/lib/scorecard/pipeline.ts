import { analyzeUrl } from "./analyze";
import { sendScorecardEmail, sendUnreadableEmail } from "./email";
import { flagScorecardFollowUp } from "./followup";
import { finalizeReport, findingTitles, scoreOf, type ReportDraft } from "./report";
import { RUBRIC_VERSION } from "./rubric";
import type { ReviewEvent, ScorecardStore, StoredScorecard } from "./store";
import { getStore, storeConfigured } from "./store.supabase";

/**
 * ONE preview pipeline, two kickoff paths.
 *
 *   self-serve (form)  → analyzeUrl → finalizeReport → store → email the requester
 *   operator (Zach)    → reviewed draft → finalizeReport → store (pending_approval)
 *                        → review copy to admin → approve → same email to prospect
 *
 * Both paths share report validation and scoring (report.ts), storage, the
 * /s/<slug> page, and the email renderer. The only differences are who starts
 * it and that an operator run waits for founder approval before reaching the
 * prospect, because the prospect did not request it themselves.
 */

/** The captured lead, passed from the submit route to the background job. */
export type ScorecardLead = {
  name: string;
  company: string;
  email: string;
  stage: string;
  url: string;
  domain: string;
  /** Attio person written by the submit route; follow-up notes attach here. */
  attioPersonId?: string;
  /** Attio rejected the email (likely a typo), so the email we send may bounce. */
  emailRejected?: boolean;
};

/** Where operator runs go for review before release. */
export function reviewInbox(): string {
  return process.env.SCORECARD_REVIEW_EMAIL || "admin@sarisari.design";
}

/** Absolute base URL the hosted report is served from (for email links). */
export function reportBaseUrl(): string {
  return (process.env.SCORECARD_PUBLIC_BASE_URL || "https://www.sarisari.design").replace(/\/+$/, "");
}

export function reportUrlFor(slug: string): string {
  return `${reportBaseUrl()}/s/${slug}`;
}

/** True when every credential the analysis + delivery path needs is configured. */
export function analysisConfigured(): boolean {
  return Boolean(
    process.env.FIRECRAWL_API_KEY && process.env.ANTHROPIC_API_KEY && process.env.RESEND_API_KEY && storeConfigured(),
  );
}

const event = (by: string, action: ReviewEvent["action"], extra: Partial<ReviewEvent> = {}): ReviewEvent => ({
  at: new Date().toISOString(),
  by,
  action,
  ...extra,
});

type Send = typeof sendScorecardEmail;
type SendUnreadable = typeof sendUnreadableEmail;
type Flag = typeof flagScorecardFollowUp;

/**
 * Self-serve background job: score the submitted URL, persist it, and email the
 * requester. Every requester gets an email:
 *   - 5 supported findings  → the scorecard.
 *   - 1 to 4                → the scorecard with only those findings (never
 *                             padded), saying so, plus an Attio follow-up note.
 *   - 0, or the page/analysis fails → a "we couldn't read your page" email, plus
 *                             an Attio follow-up note.
 * Throws are logged, not surfaced: the lead was already captured to the CRM.
 */
export async function runAnalysisAndEmail(
  lead: ScorecardLead,
  deps: { store?: ScorecardStore; analyze?: typeof analyzeUrl; send?: Send; sendUnreadable?: SendUnreadable; flag?: Flag } = {},
): Promise<StoredScorecard | null> {
  if (!deps.store && !analysisConfigured()) {
    console.warn("[scorecard] analysis skipped: missing FIRECRAWL/ANTHROPIC/RESEND/SUPABASE config:", lead.email);
    return null;
  }
  const store = deps.store ?? getStore();
  const analyze = deps.analyze ?? analyzeUrl;
  const send = deps.send ?? sendScorecardEmail;
  const sendUnreadable = deps.sendUnreadable ?? sendUnreadableEmail;
  const flag = deps.flag ?? flagScorecardFollowUp;

  /** No report possible: tell the lead honestly and flag it for a person. */
  const unreadable = async (why: string) => {
    let emailed = "not emailed";
    try {
      const { id } = await sendUnreadable(lead, reviewInbox());
      emailed = `emailed "couldn't read your page" (resend:${id ?? "unknown"})`;
    } catch (e) {
      console.error(`[scorecard] could not send unreadable email to ${lead.email}:`, e);
    }
    await flag(lead, "unreadable", [
      "The automated review could not produce a Scorecard for this page.",
      `Reason: ${why}`,
      `Lead was ${emailed} and told a designer will follow up.`,
      "Look at the page and follow up by email.",
    ]);
  };

  let row: StoredScorecard | null = null;
  try {
    // Cache: reuse the latest delivered self-serve preview for this URL. Never
    // reuse an operator run (it may be unapproved) or a failed one.
    const latest = await store.latestForUrl(lead.url);
    if (latest && latest.status === "sent" && latest.kickoff === "self_serve") {
      row = latest;
    } else {
      const gen = await analyze({ company: lead.company, url: lead.url });
      const base = {
        url: lead.url,
        domain: lead.domain,
        email: lead.email,
        name: lead.name,
        company: lead.company,
        stage: lead.stage,
        previousScore: null,
        delta: null,
        servedFromCache: false,
        kickoff: "self_serve" as const,
        rubricVersion: RUBRIC_VERSION,
        sentAt: null,
      };
      if (!gen.ok) {
        console.warn(`[scorecard] no report (${gen.reason}): ${lead.email}`);
        await store.insert({
          ...base,
          overallScore: 0,
          result: { format: "insufficient" } as unknown as StoredScorecard["result"],
          status: "failed",
          internal: { ...gen.internal, heldReason: gen.reason },
          reviewEvents: [event("generator", "failed", { reason: gen.reason })],
          lastError: `insufficient_evidence: ${gen.reason}`,
        });
        await unreadable(gen.reason);
        return null;
      }
      const { report, score } = finalizeReport(gen.draft);
      row = await store.insert({
        ...base,
        overallScore: score,
        result: report,
        status: "pending_approval",
        internal: gen.internal,
        reviewEvents: [event("generator", "created")],
        lastError: null,
      });
    }

    const { id } = await send(lead, row.result, { reportUrl: reportUrlFor(row.slug), delta: row.delta });
    if (row.status !== "sent") {
      row = await store.update(row.slug, {
        status: "sent",
        sentAt: new Date().toISOString(),
        reviewEvents: [...row.reviewEvents, event("system", "sent", { reason: `resend:${id ?? "unknown"} to requester` })],
      });
    }
    if (lead.emailRejected) {
      await flag(lead, "badEmail", [
        `Attio rejected ${lead.email}, so this Scorecard was likely sent to a bad address.`,
        `Report: ${reportUrlFor(row.slug)}`,
        "Find the correct email and send them the report link.",
      ]);
    }
    const shown = findingTitles(row.result).length;
    if (shown < 5) {
      await flag(lead, "fewFindings", [
        `The automated review found only ${shown} finding${shown === 1 ? "" : "s"} it could back with evidence.`,
        "The lead was sent that Scorecard and told a designer will take a look and follow up.",
        `Report: ${reportUrlFor(row.slug)}`,
        "Review the page and follow up by email.",
      ]);
    }
    console.log(`[scorecard] delivered to ${lead.email} (${scoreOf(row.result).score}/100) → ${reportUrlFor(row.slug)}`);
    return row;
  } catch (err) {
    console.error(`[scorecard] analysis/email failed for ${lead.email}:`, err);
    if (row && row.status !== "sent") {
      // A report exists but the email failed: flag it so someone sends it by hand.
      await store
        .update(row.slug, { status: "failed", lastError: String(err).slice(0, 500) })
        .catch((e) => console.error("[scorecard] could not record failure:", e));
      await flag(lead, "sendFailed", [
        "A Scorecard was generated but the email did not send.",
        `Error: ${String(err).slice(0, 300)}`,
        `Report: ${reportUrlFor(row.slug)}`,
        "Send the report link to the lead by hand.",
      ]);
    } else if (!row) {
      // Scrape or analysis failed: no report to send.
      await unreadable(String(err).slice(0, 300));
    }
    return null;
  }
}

/** Operator kickoff: store a reviewed draft (held) and email the review copy to admin. */
export async function createOperatorRun(
  input: { lead: ScorecardLead; draft: ReportDraft; internal: Record<string, unknown>; by: string },
  deps: { store?: ScorecardStore; send?: Send } = {},
): Promise<{ row: StoredScorecard; reportUrl: string; reviewEmailId: string | null }> {
  const store = deps.store ?? getStore();
  const send = deps.send ?? sendScorecardEmail;
  const { report, score } = finalizeReport(input.draft);
  const { lead } = input;
  let row = await store.insert({
    url: lead.url,
    domain: lead.domain,
    email: lead.email,
    name: lead.name,
    company: lead.company,
    stage: lead.stage,
    overallScore: score,
    result: report,
    previousScore: null,
    delta: null,
    servedFromCache: false,
    kickoff: "operator",
    rubricVersion: report.rubricVersion,
    status: "pending_approval",
    internal: input.internal,
    reviewEvents: [event(input.by, "created")],
    sentAt: null,
    lastError: null,
  });
  const reportUrl = reportUrlFor(row.slug);
  // The review copy is the exact email the prospect will get, addressed to admin.
  const { id } = await send(lead, report, {
    reportUrl,
    to: reviewInbox(),
    subjectPrefix: `[REVIEW: ${lead.company} to ${lead.email}] `,
  });
  row = await store.update(row.slug, {
    reviewEvents: [...row.reviewEvents, event("system", "created", { reason: `review copy resend:${id ?? "unknown"}` })],
  });
  return { row, reportUrl, reviewEmailId: id };
}

/** Replace a held operator run's report. Founder edits become learning feedback. */
export async function reviseOperatorRun(
  slug: string,
  input: { draft: ReportDraft; by: string; reason: string; changes: string[]; internal?: Record<string, unknown> },
  deps: { store?: ScorecardStore } = {},
): Promise<StoredScorecard> {
  const store = deps.store ?? getStore();
  const row = await store.getBySlug(slug);
  if (!row) throw new Error(`no run for ${slug}`);
  if (row.status !== "pending_approval") throw new Error(`run ${slug} is ${row.status}; only held runs can be revised`);
  const { report, score } = finalizeReport(input.draft);
  return store.update(slug, {
    result: report,
    overallScore: score,
    internal: input.internal ?? row.internal,
    reviewEvents: [...row.reviewEvents, event(input.by, "revised", { reason: input.reason, changes: input.changes })],
  });
}

/**
 * Release a held operator run to the prospect. This is the only path that emails
 * a prospect who did not request a preview, and it refuses anything that is not
 * pending approval. `approvedBy` records the founder approval.
 */
export async function approveAndSend(
  slug: string,
  input: { approvedBy: string; note?: string },
  deps: { store?: ScorecardStore; send?: Send } = {},
): Promise<{ row: StoredScorecard; emailId: string | null }> {
  const store = deps.store ?? getStore();
  const send = deps.send ?? sendScorecardEmail;
  if (!input.approvedBy.trim()) throw new Error("approvedBy is required");
  let row = await store.getBySlug(slug);
  if (!row) throw new Error(`no run for ${slug}`);
  if (row.kickoff !== "operator") throw new Error(`run ${slug} is not an operator run`);
  if (row.status !== "pending_approval") throw new Error(`run ${slug} is ${row.status}; refusing to send`);
  const events = [...row.reviewEvents, event(input.approvedBy, "approved", { reason: input.note })];
  row = await store.update(slug, { reviewEvents: events });
  try {
    const lead: ScorecardLead = {
      name: row.name, company: row.company, email: row.email, stage: row.stage, url: row.url, domain: row.domain,
    };
    const { id } = await send(lead, row.result, { reportUrl: reportUrlFor(slug) });
    row = await store.update(slug, {
      status: "sent",
      sentAt: new Date().toISOString(),
      lastError: null,
      reviewEvents: [...events, event("system", "sent", { reason: `resend:${id ?? "unknown"} to ${row.email}` })],
    });
    return { row, emailId: id };
  } catch (err) {
    // Stay pending so a retry is possible; record the failure.
    await store.update(slug, { lastError: String(err).slice(0, 500) }).catch(() => {});
    throw err;
  }
}
