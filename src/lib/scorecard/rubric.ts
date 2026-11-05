import { RUBRIC_SOURCE_VERSION } from "./rubric-anchors.generated";

/**
 * Activation Scoring Rubric, encoded for the Activation Scorecard Preview.
 *
 * Canonical source: 00_Vault/02_Areas/05_design/activation-scoring-rubric.md.
 * Weights (Section 3), bands and their fixed framing copy (Section 5), and the
 * Preview Score sub-profiles (Sections 6.2 and 6.3) live here; anchors (Section 4)
 * are copied verbatim into rubric-anchors.generated.ts by scripts/sync-rubric.mjs.
 *
 * Any rubric change is a version bump approved by Zach and Patti. After a bump:
 * re-run the sync script, update this file, and the version test will hold both
 * in step. Stored reports pin the version they were scored on and are never
 * re-scored silently.
 */

export const RUBRIC_VERSION = "1.0";

if (RUBRIC_VERSION !== RUBRIC_SOURCE_VERSION) {
  // Fails loudly at import time in tests and builds if the two drift apart.
  throw new Error(
    `rubric.ts is v${RUBRIC_VERSION} but rubric-anchors.generated.ts is v${RUBRIC_SOURCE_VERSION}`,
  );
}

export const DIMENSION_CODES = [
  "ONB",
  "FORM",
  "N",
  "MOB",
  "IXD",
  "CRO",
  "COPY",
  "ACC",
  "VD",
  "IA",
  "QA",
  "PERF",
] as const;
export type DimensionCode = (typeof DIMENSION_CODES)[number];

export const DIMENSIONS: Record<DimensionCode, { name: string; weight: number }> = {
  ONB: { name: "Onboarding & Activation", weight: 18 },
  FORM: { name: "Forms & Input", weight: 15 },
  N: { name: "Usability Heuristics", weight: 10 },
  MOB: { name: "Mobile UX", weight: 10 },
  IXD: { name: "Interaction Design", weight: 9 },
  CRO: { name: "Conversion Entry", weight: 8 },
  COPY: { name: "Content & Copywriting", weight: 8 },
  ACC: { name: "Accessibility", weight: 8 },
  VD: { name: "Visual & Brand Design", weight: 6 },
  IA: { name: "Information Architecture", weight: 4 },
  QA: { name: "Bugs & Defects", weight: 4 },
  // Preview URL sub-profile only (rubric 6.2), base weight 6 before renormalizing.
  PERF: { name: "Performance", weight: 6 },
};

/** Preview Score sub-profiles: which dimensions may be rated (rubric 6.2, 6.3). */
export const PROFILES = {
  url: ["ONB", "FORM", "N", "MOB", "IXD", "CRO", "COPY", "ACC", "VD", "IA", "PERF"],
  video: ["ONB", "FORM", "N", "MOB", "IXD", "CRO", "COPY", "VD", "IA"],
} as const satisfies Record<string, readonly DimensionCode[]>;
export type PreviewProfile = keyof typeof PROFILES;

/** Any Critical finding in a dimension caps its rating here (rubric 1.4). */
export const CRITICAL_CAP = 4;

/** Fixed bands and client-facing framing, verbatim from rubric Section 5. */
export const BANDS = [
  {
    min: 80,
    name: "Activation-Ready",
    framing:
      "Your onboarding holds up well when measured against best-practice activation patterns for health and wellness products. The fundamentals are working: users can reach first value without fighting the interface. The findings in this scorecard are refinements, the kind that separate a good flow from a benchmark one.",
  },
  {
    min: 60,
    name: "Solid Foundation",
    framing:
      "Your flow is fundamentally sound, measured against best-practice activation patterns for health and wellness products, with specific gaps holding it back. Users get through, but a handful of fixable friction points are deterring a portion of them before first value. The dimension breakdown shows exactly where.",
  },
  {
    min: 40,
    name: "Friction-Heavy, but Fixable",
    framing:
      "Measured against best-practice activation patterns for health and wellness products, your flow carries friction at several points where users decide whether to continue. Products in this range usually see meaningful signup-to-activation drop-off, and it is the recoverable kind. The top findings in this scorecard are the places to start.",
  },
  {
    min: 0,
    name: "Blockers, but Fixable",
    framing:
      "Measured against best-practice activation patterns for health and wellness products, your flow has a few issues serious enough to stop users from activating, not just slow them down. That sounds worse than it is: blockers are usually the clearest problems to fix, and clearing them tends to move activation more than any polish work would.",
  },
] as const;

export type RatedDimension = { code: DimensionCode; rating: number; capped: boolean };

/** Rating after the Critical cap. */
export function effectiveRating(d: RatedDimension): number {
  return d.capped ? Math.min(d.rating, CRITICAL_CAP) : d.rating;
}

/**
 * Preview Score: Σ(rating × weight) over the rated dimensions, with weights
 * renormalized to the in-scope total, scaled to 0–100 and rounded.
 */
export function computeScore(dims: RatedDimension[]): number {
  if (dims.length === 0) throw new Error("no dimensions rated");
  const totalWeight = dims.reduce((s, d) => s + DIMENSIONS[d.code].weight, 0);
  const weighted = dims.reduce((s, d) => s + effectiveRating(d) * DIMENSIONS[d.code].weight, 0);
  return Math.round((weighted / totalWeight) * 10);
}

export function bandFor(score: number): (typeof BANDS)[number] {
  return BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1];
}
