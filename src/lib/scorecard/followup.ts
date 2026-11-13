import type { ScorecardLead } from "./pipeline";

/**
 * Flags a Scorecard request for a human to look at, as a note on the lead's
 * Attio person (found by email). Used when the automated review found fewer
 * than five findings, could not read the page, or could not send the email.
 *
 * Titles never equal the request note title, so the one-per-email dedupe check
 * (exact title match in the submit route) ignores them. Best-effort: logs and
 * returns on any error, because the lead has already been emailed or captured.
 */

const API = "https://api.attio.com/v2";
const TIMEOUT_MS = 10_000;

export const FOLLOW_UP_TITLES = {
  fewFindings: "Scorecard follow-up: fewer than 5 findings",
  unreadable: "Scorecard follow-up: page could not be read",
  sendFailed: "Scorecard follow-up: email did not send",
} as const;
export type FollowUpKind = keyof typeof FOLLOW_UP_TITLES;

export async function flagScorecardFollowUp(
  lead: ScorecardLead,
  kind: FollowUpKind,
  detail: string[],
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const key = process.env.ATTIO_API_KEY;
  if (!key) {
    console.warn(`[scorecard] ATTIO_API_KEY unset, follow-up not flagged (${kind}): ${lead.email}`);
    return;
  }
  const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  try {
    const q = await fetchImpl(`${API}/objects/people/records/query`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({ filter: { email_addresses: lead.email }, limit: 1 }),
    });
    if (!q.ok) throw new Error(`person lookup ${q.status}`);
    const personId = ((await q.json()) as { data?: Array<{ id?: { record_id?: string } }> }).data?.[0]?.id?.record_id;
    if (!personId) {
      console.warn(`[scorecard] no Attio person for ${lead.email}, follow-up not flagged (${kind})`);
      return;
    }
    const note = await fetchImpl(`${API}/notes`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        data: {
          parent_object: "people",
          parent_record_id: personId,
          title: FOLLOW_UP_TITLES[kind],
          format: "plaintext",
          content: [...detail, "", `Company: ${lead.company}`, `Email: ${lead.email}`, `URL submitted: ${lead.url}`].join("\n"),
        },
      }),
    });
    if (!note.ok) throw new Error(`note create ${note.status}`);
  } catch (err) {
    console.error(`[scorecard] could not flag follow-up (${kind}) for ${lead.email}:`, err);
  }
}
