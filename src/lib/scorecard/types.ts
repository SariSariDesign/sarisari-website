import { z } from "zod";
import { DIMENSION_CODES, PROFILES } from "./rubric";

/**
 * Activation Scorecard Preview, format v1: the ONE report shape every preview
 * uses, whether the prospect kicked it off through the public form or Zach
 * kicked it off as an operator run. It is scored on the Activation Scoring
 * Rubric (see ./rubric.ts) and is always a preview: exactly five findings and
 * a Preview Score. The paid Activation Score is a different deliverable and is
 * never produced by this system.
 */

export const PREVIEW_FORMAT = "preview-v1" as const;
export const SEVERITIES = ["critical", "major", "minor"] as const;
export const RATINGS = ["high", "medium", "low"] as const;
export const KICKOFFS = ["self_serve", "operator"] as const;
export const SOURCES = ["url", "recording"] as const;
export type Kickoff = (typeof KICKOFFS)[number];

const noDashes = (s: string) => !/[\u2013\u2014]/.test(s);
const text = z.string().trim().min(1).refine(noDashes, "no em or en dashes in client-facing copy");

export const dimensionRatingSchema = z.object({
  code: z.enum(DIMENSION_CODES),
  rating: z.number().int().min(0).max(10),
  capped: z.boolean(),
  note: text,
});

export const findingSchema = z.object({
  page: text,
  dimension: z.enum(DIMENSION_CODES),
  severity: z.enum(SEVERITIES),
  title: text,
  observation: text,
  whyItMatters: text,
  criteria: z.array(z.string().regex(/^[A-Z]{1,4}-\d{2}$/)).min(1),
  recommendations: z.array(text).min(1).max(3),
  effort: z.enum(RATINGS),
  impact: z.enum(RATINGS),
  /** Key of an evidence image in the report's screenshot storage, or null. */
  image: z
    .object({ key: z.string().regex(/^[a-z0-9-]+\.(png|jpe?g|webp)$/), alt: text, caption: text })
    .nullable(),
});

export const researchSchema = z.object({ title: text, stat: text, body: text, source: text });

export const previewReportSchema = z
  .object({
    format: z.literal(PREVIEW_FORMAT),
    rubricVersion: z.string().min(1),
    source: z.enum(SOURCES),
    profile: z.enum(["url", "video"]),
    company: text,
    companyUrl: z.string().url(),
    auditDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    profileFacts: z.object({
      industry: text,
      stage: text,
      gtmModel: text,
      conversionGoal: text,
      customerType: text,
    }),
    whyThisMatters: text,
    scopeNote: text,
    methodology: text,
    evaluationLens: text,
    disclaimer: text,
    dimensions: z.array(dimensionRatingSchema).min(3),
    /** Total findings evaluated before the top five were selected. */
    totalFindings: z.number().int().min(5),
    findings: z.array(findingSchema).length(5),
    research: z.array(researchSchema).max(3),
    aiBuilderChanges: z.array(text).length(5),
  })
  .superRefine((r, ctx) => {
    const allowed = new Set<string>(PROFILES[r.profile]);
    const seen = new Set<string>();
    for (const d of r.dimensions) {
      if (!allowed.has(d.code))
        ctx.addIssue({ code: "custom", message: `${d.code} is not rated in the ${r.profile} profile` });
      if (seen.has(d.code)) ctx.addIssue({ code: "custom", message: `${d.code} rated twice` });
      seen.add(d.code);
    }
    if (r.profile === "video" && r.source !== "recording")
      ctx.addIssue({ code: "custom", message: "video profile requires a recording source" });
    for (const f of r.findings) {
      if (!seen.has(f.dimension))
        ctx.addIssue({ code: "custom", message: `finding "${f.title}" cites unrated dimension ${f.dimension}` });
      if (f.severity === "critical" && !r.dimensions.find((d) => d.code === f.dimension)?.capped)
        ctx.addIssue({ code: "custom", message: `Critical finding in ${f.dimension} requires the dimension cap` });
    }
  });

export type PreviewReport = z.infer<typeof previewReportSchema>;
export type PreviewFinding = z.infer<typeof findingSchema>;
export type DimensionRating = z.infer<typeof dimensionRatingSchema>;
