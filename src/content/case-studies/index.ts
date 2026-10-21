import { fundingSolutions } from "./funding-solutions";
import { genwell } from "./genwell";
import { kenchanRamen } from "./kenchan-ramen";
import type { CaseStudy } from "./types";

export type { CaseStudy, CaseStudyBlock } from "./types";

/**
 * Case studies in homepage order. To add one (e.g. NutriSnap, Lendzi): copy
 * `funding-solutions.ts`, fill in `card` (and `page` when it's ready to publish), then
 * add it to this list.
 */
export const caseStudies: CaseStudy[] = [kenchanRamen, fundingSolutions, genwell];

export const publishedCaseStudies = caseStudies.filter((c) => c.status === "published");

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** Link for a case study, or null while it's still coming soon. */
export const caseStudyHref = (c: CaseStudy) =>
  c.status === "published" ? `/work/${c.slug}` : null;
