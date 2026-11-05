import type { LegacyScorecardResult } from "./legacy-types";
import type { Kickoff, PreviewReport } from "./types";

/**
 * Lifecycle of a stored preview:
 *  - pending_approval: operator run, saved and reviewable at /s/<slug>, email held
 *  - sent: the report email was delivered to the recipient
 *  - failed: generation or delivery failed (see lastError)
 */
export type PreviewStatus = "pending_approval" | "sent" | "failed";

/** One entry in a run's review trail; founder edits here are learning feedback. */
export type ReviewEvent = {
  at: string; // ISO 8601
  by: string;
  action: "created" | "revised" | "approved" | "sent" | "failed";
  reason?: string;
  /** Field-level summary of what changed, for revisions. */
  changes?: string[];
};

/** One persisted scorecard run. `url` is the cache/cooldown/compare key. */
export type StoredScorecard = {
  id: string;
  /** Unguessable slug the hosted report is served under (/s/<slug>). */
  slug: string;
  url: string;
  domain: string;
  email: string;
  name: string;
  company: string;
  stage: string;
  overallScore: number;
  /** preview-v1 report, or the legacy 11-dimension result for older rows. */
  result: PreviewReport | LegacyScorecardResult;
  previousScore: number | null;
  delta: number | null;
  servedFromCache: boolean;
  createdAt: string; // ISO 8601
  /** Learning-record fields. Older rows default to self_serve / null. */
  kickoff: Kickoff;
  rubricVersion: string | null;
  status: PreviewStatus;
  /** Private scoring record (rating rationale, cut findings). Never rendered. */
  internal: Record<string, unknown> | null;
  reviewEvents: ReviewEvent[];
  sentAt: string | null;
  lastError: string | null;
};

/** The slug is minted by the store at insert time, not supplied by the caller. */
export type NewScorecard = Omit<StoredScorecard, "id" | "slug" | "createdAt">;

export type ScorecardPatch = Partial<
  Pick<
    StoredScorecard,
    | "result"
    | "overallScore"
    | "status"
    | "internal"
    | "reviewEvents"
    | "sentAt"
    | "lastError"
    | "email"
    | "name"
    | "rubricVersion"
  >
>;

/** Persistence boundary. Supabase in prod; in-memory fake in tests. */
export interface ScorecardStore {
  /** Most recent row for a URL, or null. Drives cooldown + delta. */
  latestForUrl(url: string): Promise<StoredScorecard | null>;
  /** True if this email already has any row for this URL. */
  hasRowForUrlEmail(url: string, email: string): Promise<boolean>;
  /** Persist a run; returns the stored row (with id + slug + createdAt). */
  insert(row: NewScorecard): Promise<StoredScorecard>;
  /** Fetch a run by its slug, for the hosted /s/<slug> page. */
  getBySlug(slug: string): Promise<StoredScorecard | null>;
  /** Update a run by slug; returns the updated row. */
  update(slug: string, patch: ScorecardPatch): Promise<StoredScorecard>;
  /** Runs created at or after `since`, newest first (calibration exports). */
  listSince(since: string): Promise<StoredScorecard[]>;
}

/** Private evidence images, served only through /s/<slug>/evidence/<key>. */
export interface EvidenceStore {
  put(slug: string, key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  get(slug: string, key: string): Promise<{ bytes: Uint8Array; contentType: string } | null>;
}

/** Defaults for the learning-record fields when inserting a self-serve run. */
export function selfServeDefaults(): Pick<
  NewScorecard,
  "kickoff" | "status" | "internal" | "reviewEvents" | "sentAt" | "lastError"
> {
  return { kickoff: "self_serve", status: "sent", internal: null, reviewEvents: [], sentAt: null, lastError: null };
}
