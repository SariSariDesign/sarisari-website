import { DIMENSIONS, RUBRIC_VERSION, bandFor, computeScore, type PreviewProfile } from "./rubric";
import { PREVIEW_FORMAT, previewReportSchema, type PreviewReport } from "./types";
import type { LegacyScorecardResult } from "./legacy-types";

/**
 * Shared report assembly for BOTH kickoff paths. Whatever produced the content
 * (the automated generator for a form submission, or an operator-reviewed run),
 * it goes through `finalizeReport`, which validates the preview-v1 shape and
 * computes the score and band from the rubric. Callers never supply the score.
 */

/** Fixed, source-accurate copy (skill: "adapt the methodology and disclaimer to the actual source"). */
export function fixedCopy(source: "url" | "recording", company: string, dimensionCount: number) {
  if (source === "recording") {
    return {
      scopeNote: "Scored from the first-run recording, and only what that recording showed.",
      methodology: `An AI-assisted analyst evaluated ${dimensionCount} UX dimensions from frames of a first-run screen recording against a Nielsen Norman Group grounded framework, with each rating checked by a second reviewer for accuracy and business relevance.`,
      disclaimer: `This preview is based on a screen recording of ${company}'s first run. Direct access to the product, supporting flows, analytics, and user data would enable a deeper, more comprehensive review.`,
    };
  }
  return {
    scopeNote: "Scored from your publicly reachable flow, from landing through signup.",
    methodology: `An AI-assisted analyst evaluated ${dimensionCount} UX dimensions against a Nielsen Norman Group grounded framework, using the page content and an above-the-fold capture.`,
    disclaimer: `This preview is based on ${company}'s publicly available site. Direct access to the product, supporting flows, analytics, and user data would enable a deeper, more comprehensive review.`,
  };
}

export type ReportDraft = Omit<PreviewReport, "format" | "rubricVersion"> & {
  format?: string;
  rubricVersion?: string;
};

/** Validate a draft, sort dimensions heaviest-first, and pin the rubric version. */
export function finalizeReport(draft: ReportDraft): { report: PreviewReport; score: number; band: ReturnType<typeof bandFor> } {
  if (draft.rubricVersion && draft.rubricVersion !== RUBRIC_VERSION) {
    throw new Error(
      `report was scored on rubric v${draft.rubricVersion}, but this system runs v${RUBRIC_VERSION}. Re-score on the current version.`,
    );
  }
  const report = previewReportSchema.parse({
    ...draft,
    format: PREVIEW_FORMAT,
    rubricVersion: RUBRIC_VERSION,
    dimensions: [...draft.dimensions].sort((a, b) => DIMENSIONS[b.code].weight - DIMENSIONS[a.code].weight),
  });
  const score = computeScore(report.dimensions);
  return { report, score, band: bandFor(score) };
}

export function isPreviewReport(r: PreviewReport | LegacyScorecardResult): r is PreviewReport {
  return (r as PreviewReport).format === PREVIEW_FORMAT;
}

/** Score + band for any stored result (legacy rows carry their own). */
export function scoreOf(r: PreviewReport | LegacyScorecardResult): { score: number; bandName: string } {
  if (isPreviewReport(r)) {
    const score = computeScore(r.dimensions);
    return { score, bandName: bandFor(score).name };
  }
  return { score: r.overallScore, bandName: r.bandName };
}

export function bandOfReport(r: PreviewReport | LegacyScorecardResult | { format?: string }): string | null {
  const x = r as PreviewReport | LegacyScorecardResult;
  if (isPreviewReport(x)) return scoreOf(x).bandName;
  return "bandName" in x && typeof x.bandName === "string" ? x.bandName : null;
}

export function findingTitles(r: PreviewReport | LegacyScorecardResult): string[] {
  return isPreviewReport(r) ? r.findings.map((f) => f.title) : r.topFindings.map((f) => f.title);
}

export function profileFor(source: "url" | "recording"): PreviewProfile {
  return source === "recording" ? "video" : "url";
}
