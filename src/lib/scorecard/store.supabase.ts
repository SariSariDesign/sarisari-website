import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  EvidenceStore,
  NewScorecard,
  ScorecardPatch,
  ScorecardStore,
  StoredScorecard,
} from "./store";

/**
 * Supabase-backed ScorecardStore (production): cache/cooldown lookups by URL,
 * per-email dedupe, insert (minting the unguessable slug), slug lookup for the
 * hosted /s/<slug> page, status/review updates, and calibration listing.
 * Table DDL and migrations live in store.sql.
 */

const TABLE = "scorecard_reports";
const BUCKET = "scorecard-evidence";

/** Project URL (either env name works). */
function supabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/**
 * True when the store's credentials are configured. Uses the SERVICE-ROLE key
 * (server-only, bypasses RLS), not the anon key, because it writes lead PII and
 * reads private reports while the table stays locked to the public.
 */
export function storeConfigured(): boolean {
  return Boolean(supabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let client: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (!storeConfigured()) {
    throw new Error("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) / SUPABASE_SERVICE_ROLE_KEY are not set");
  }
  client ??= createClient(supabaseUrl() as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/** Unguessable slug: a readable company prefix plus random hex. */
export function makeSlug(company: string): string {
  const prefix =
    company
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "scorecard";
  const rand = globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return `${prefix}-${rand}`;
}

/* Column names in the DB use snake_case; map to/from the camelCase domain type. */
type Row = {
  id: string;
  slug: string;
  url: string;
  domain: string;
  email: string;
  name: string;
  company: string;
  stage: string;
  overall_score: number;
  result: StoredScorecard["result"];
  previous_score: number | null;
  delta: number | null;
  served_from_cache: boolean;
  created_at: string;
  kickoff?: StoredScorecard["kickoff"];
  rubric_version?: string | null;
  status?: StoredScorecard["status"];
  internal?: StoredScorecard["internal"];
  review_events?: StoredScorecard["reviewEvents"];
  sent_at?: string | null;
  last_error?: string | null;
};

export function toStored(r: Row): StoredScorecard {
  return {
    id: r.id,
    slug: r.slug,
    url: r.url,
    domain: r.domain,
    email: r.email,
    name: r.name,
    company: r.company,
    stage: r.stage,
    overallScore: r.overall_score,
    result: r.result,
    previousScore: r.previous_score,
    delta: r.delta,
    servedFromCache: r.served_from_cache,
    createdAt: r.created_at,
    kickoff: r.kickoff ?? "self_serve",
    rubricVersion: r.rubric_version ?? null,
    status: r.status ?? "sent",
    internal: r.internal ?? null,
    reviewEvents: r.review_events ?? [],
    sentAt: r.sent_at ?? null,
    lastError: r.last_error ?? null,
  };
}

function toRow(p: ScorecardPatch): Record<string, unknown> {
  const map: Record<string, string> = {
    result: "result",
    overallScore: "overall_score",
    status: "status",
    internal: "internal",
    reviewEvents: "review_events",
    sentAt: "sent_at",
    lastError: "last_error",
    email: "email",
    name: "name",
    rubricVersion: "rubric_version",
  };
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) if (v !== undefined) out[map[k]] = v;
  return out;
}

export function createSupabaseStore(): ScorecardStore {
  return {
    async latestForUrl(url) {
      const { data, error } = await db()
        .from(TABLE)
        .select("*")
        .eq("url", url)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`[scorecard-store] latestForUrl: ${error.message}`);
      return data ? toStored(data as Row) : null;
    },

    async hasRowForUrlEmail(url, email) {
      const { data, error } = await db()
        .from(TABLE)
        .select("id")
        .eq("url", url)
        .eq("email", email)
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`[scorecard-store] hasRowForUrlEmail: ${error.message}`);
      return Boolean(data);
    },

    async insert(row: NewScorecard) {
      const slug = makeSlug(row.company);
      const { data, error } = await db()
        .from(TABLE)
        .insert({
          slug,
          url: row.url,
          domain: row.domain,
          email: row.email,
          name: row.name,
          company: row.company,
          stage: row.stage,
          overall_score: row.overallScore,
          result: row.result,
          previous_score: row.previousScore,
          delta: row.delta,
          served_from_cache: row.servedFromCache,
          kickoff: row.kickoff,
          rubric_version: row.rubricVersion,
          status: row.status,
          internal: row.internal,
          review_events: row.reviewEvents,
          sent_at: row.sentAt,
          last_error: row.lastError,
        })
        .select("*")
        .single();
      if (error) throw new Error(`[scorecard-store] insert: ${error.message}`);
      return toStored(data as Row);
    },

    async getBySlug(slug) {
      const { data, error } = await db().from(TABLE).select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(`[scorecard-store] getBySlug: ${error.message}`);
      return data ? toStored(data as Row) : null;
    },

    async update(slug, patch) {
      const { data, error } = await db().from(TABLE).update(toRow(patch)).eq("slug", slug).select("*").single();
      if (error) throw new Error(`[scorecard-store] update: ${error.message}`);
      return toStored(data as Row);
    },

    async listSince(since) {
      const { data, error } = await db()
        .from(TABLE)
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw new Error(`[scorecard-store] listSince: ${error.message}`);
      return (data as Row[]).map(toStored);
    },
  };
}

export function createSupabaseEvidence(): EvidenceStore {
  return {
    async put(slug, key, bytes, contentType) {
      const { error } = await db()
        .storage.from(BUCKET)
        .upload(`${slug}/${key}`, bytes, { contentType, upsert: true });
      if (error) throw new Error(`[scorecard-evidence] put ${slug}/${key}: ${error.message}`);
    },
    async get(slug, key) {
      const { data, error } = await db().storage.from(BUCKET).download(`${slug}/${key}`);
      if (error || !data) return null;
      return { bytes: new Uint8Array(await data.arrayBuffer()), contentType: data.type || "image/png" };
    },
  };
}

/** The store used by server code: Supabase when configured. */
export function getStore(): ScorecardStore {
  return createSupabaseStore();
}

export function getEvidenceStore(): EvidenceStore {
  return createSupabaseEvidence();
}
