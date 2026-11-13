import { NextResponse, after } from "next/server";
import { runAnalysisAndEmail } from "@/lib/scorecard/pipeline";
import { companyDomainFor } from "./personal-domains";

/**
 * Free Activation Scorecard lead capture.
 *
 * Flow: validate → capture the lead in Attio (upsert person, create company only
 * if none exists for a work-email domain — never rename an existing one — and a
 * note holding
 * the full submission) → (Phase 2) enqueue the background analysis job. We return
 * 200 quickly and never surface a CRM failure to the visitor in a way that loses
 * the lead — capture is best-effort and logged server-side.
 *
 * Runs on the Node.js runtime (not edge) so we can talk to Attio's REST API.
 */
export const runtime = "nodejs";

// The background analysis (FireCrawl → Claude → Resend) runs via after() and can
// take ~30–60s+, so allow a generous ceiling. Requires Vercel Pro fluid compute
// for the upper end; on Hobby this caps lower and long analyses may be cut off.
export const maxDuration = 300;

const ATTIO_BASE = "https://api.attio.com/v2";

// The note we attach on every scorecard request doubles as the per-email dedupe
// marker: if a Person already has one, they've requested before.
const SCORECARD_NOTE_TITLE = "Free Activation Scorecard request";
// Used when Attio rejects the email. A different title on purpose: it stands out in
// the Notes list, and the one-per-email dedupe check (exact title match) ignores it.
const SCORECARD_NOTE_TITLE_EMAIL_REJECTED = "Free Activation Scorecard request (check email)";

type Payload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  stage?: unknown;
  url?: unknown;
  faxNumber?: unknown; // honeypot
  attribution?: unknown; // ad click IDs + UTM tags from the landing URL
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** Normalize a possibly-bare URL and pull out its hostname (no www). */
function parseUrl(raw: string): { url: string; domain: string } | null {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".")) return null;
    return { url: u.toString(), domain: u.hostname.replace(/^www\./i, "") };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Pretend success, do nothing.
  if (str(body.faxNumber)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name);
  const company = str(body.company);
  const email = str(body.email);
  const stage = str(body.stage);
  const parsed = parseUrl(str(body.url));

  if (!name || !company || !isEmail(email) || !stage || !parsed) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const attribution = cleanAttribution(body.attribution);
  const lead = { name, company, email, stage, url: parsed.url, domain: parsed.domain, attribution };

  // Dedupe: one scorecard per email. We check Attio for a prior scorecard note on
  // this person BEFORE writing our own (so the first request isn't self-blocked).
  // Fails open — a check error never blocks a legitimate lead.
  const duplicate = await alreadyRequested(email);

  // Best-effort CRM capture — failures are logged, not returned to the user.
  // On a repeat we still refresh the contact but skip adding another note.
  try {
    await captureToAttio(lead, { addNote: !duplicate });
  } catch (err) {
    console.error("[scorecard-request] Attio capture failed:", err);
  }

  // Only run the (paid) analysis + email for a first-time email. Repeat requests
  // are captured but not re-analyzed. after() runs within this invocation's
  // lifetime (see maxDuration); it no-ops until the FireCrawl/Anthropic/Resend
  // keys are configured. For higher durability, swap for a queue (Upstash QStash).
  if (!duplicate) {
    after(() => runAnalysisAndEmail(lead));
  }

  return NextResponse.json({ ok: true, duplicate });
}

/* -------------------------------------------------------------------------- */

type Lead = {
  name: string;
  company: string;
  email: string;
  stage: string;
  url: string;
  domain: string;
  attribution?: Record<string, string>;
};

/** Keep only short string values from known-safe keys. */
function cleanAttribution(v: unknown): Record<string, string> {
  if (!v || typeof v !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (/^[a-z_]{2,20}$/.test(k) && typeof val === "string" && val) out[k] = val.slice(0, 200);
  }
  return out;
}

async function attio(path: string, init: RequestInit) {
  const key = process.env.ATTIO_API_KEY;
  if (!key) throw new Error("ATTIO_API_KEY is not set");
  const res = await fetch(`${ATTIO_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Attio ${init.method} ${path} → ${res.status} ${detail}`);
  }
  return res.json();
}

/**
 * Upsert the lead into Attio using standard objects, then attach a note with the
 * full submission so no detail is lost even if custom attributes aren't mapped yet.
 *
 * NOTE: object/attribute slugs below are Attio's defaults. Confirm they match this
 * workspace's schema — if custom objects or attributes are used, adjust accordingly.
 */
/**
 * Returns true if this email has already requested a scorecard — i.e. their
 * Person record already carries our scorecard note. Fails OPEN (returns false)
 * on any error so a transient CRM issue never blocks a real lead.
 */
async function alreadyRequested(email: string): Promise<boolean> {
  if (!process.env.ATTIO_API_KEY) return false;
  try {
    const q = (await attio("/objects/people/records/query", {
      method: "POST",
      body: JSON.stringify({ filter: { email_addresses: email }, limit: 1 }),
    })) as { data?: Array<{ id?: { record_id?: string } }> };

    const personId = q.data?.[0]?.id?.record_id;
    if (!personId) return false;

    const notes = (await attio(
      `/notes?parent_object=people&parent_record_id=${personId}&limit=50`,
      { method: "GET" },
    )) as { data?: Array<{ title?: string }> };

    return (notes.data ?? []).some((n) => n.title === SCORECARD_NOTE_TITLE);
  } catch (err) {
    console.error("[scorecard-request] dedupe check failed (allowing):", err);
    return false;
  }
}

/**
 * Create the lead's company only if none exists. The company is identified by
 * the visitor's EMAIL domain only (see companyDomainFor); a personal / free
 * email skips the company step entirely, with no Attio requests.
 * We never write to an existing company: a visitor-typed name must not
 * overwrite our CRM data (an upsert here once renamed a real company record).
 * Fails safe — any lookup error skips the company write entirely; a create
 * failure (e.g. a uniqueness conflict from a concurrent request) is logged and
 * never retried as an upsert.
 */
async function ensureCompany(lead: Lead) {
  const companyDomain = companyDomainFor(lead.email);
  if (!companyDomain) return;

  let exists: boolean;
  try {
    const q = (await attio("/objects/companies/records/query", {
      method: "POST",
      body: JSON.stringify({ filter: { domains: companyDomain }, limit: 1 }),
    })) as { data?: unknown[] };
    exists = (q.data?.length ?? 0) > 0;
  } catch (e) {
    console.error("[scorecard-request] company lookup failed (skipping company write):", e);
    return;
  }
  if (exists) return;

  await attio("/objects/companies/records", {
    method: "POST",
    body: JSON.stringify({
      data: { values: { name: lead.company, domains: [companyDomain] } },
    }),
  }).catch((e) => console.error("[scorecard-request] company create failed:", e));
}

async function captureToAttio(lead: Lead, opts: { addNote: boolean }) {
  if (!process.env.ATTIO_API_KEY) {
    console.warn("[scorecard-request] ATTIO_API_KEY unset — skipping CRM capture:", lead.email);
    return;
  }

  // 1) Ensure a company exists for this domain — create-only, never update.
  await ensureCompany(lead);

  // 2) Upsert person by email (standard "people" object). Returns the record id.
  //    Attio's personal-name attribute requires first_name + last_name (not just
  //    full_name), so split on the first space.
  const trimmed = lead.name.trim();
  const spaceIdx = trimmed.indexOf(" ");
  const firstName = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
  const lastName = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1).trim();

  const name = [{ first_name: firstName, last_name: lastName, full_name: trimmed }];

  let personId: string | undefined;
  let emailRejected = false;
  try {
    const person = (await attio("/objects/people/records?matching_attribute=email_addresses", {
      method: "PUT",
      body: JSON.stringify({ data: { values: { name, email_addresses: [lead.email] } } }),
    })) as { data?: { id?: { record_id?: string } } };
    personId = person?.data?.id?.record_id;
  } catch (err) {
    // Attio rejects emails it can't validate (usually a typo, e.g. ".desin"). Keep
    // the lead anyway: save the person by name only and flag the note, so someone
    // can follow up and send the Scorecard by hand.
    console.error("[scorecard-request] Attio rejected the email, saving lead without it:", err);
    emailRejected = true;
    const person = (await attio("/objects/people/records", {
      method: "POST",
      body: JSON.stringify({ data: { values: { name } } }),
    })) as { data?: { id?: { record_id?: string } } };
    personId = person?.data?.id?.record_id;
  }

  // 3) Attach a note with the complete submission (schema-independent). Skipped on
  //    a repeat request so we don't pile up duplicate notes.
  if (personId && opts.addNote) {
    await attio("/notes", {
      method: "POST",
      body: JSON.stringify({
        data: {
          parent_object: "people",
          parent_record_id: personId,
          title: emailRejected ? SCORECARD_NOTE_TITLE_EMAIL_REJECTED : SCORECARD_NOTE_TITLE,
          format: "plaintext",
          content: [
            ...(emailRejected
              ? ["⚠️ Attio rejected this email, likely a typo. Check it and send the Scorecard by hand.", ""]
              : []),
            `Name: ${lead.name}`,
            `Company: ${lead.company}`,
            `Email: ${lead.email}`,
            `Funding stage: ${lead.stage}`,
            `URL submitted: ${lead.url}`,
            ...Object.entries(lead.attribution ?? {}).map(([k, v]) => `${k}: ${v}`),
          ].join("\n"),
        },
      }),
    }).catch((e) => console.error("[scorecard-request] note create failed:", e));
  }
}
