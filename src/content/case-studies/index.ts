import { disco } from "./disco";
import { fundingSolutions } from "./funding-solutions";
import { kenchanRamen } from "./kenchan-ramen";
import { lendzi } from "./lendzi";
import { nutrisnap } from "./nutrisnap";
import type { CaseStudy } from "./types";

export type { CaseStudy, CaseStudyBlock } from "./types";

/**
 * Case studies in display order. To add one, follow the steps in `_template.ts`
 * (which is deliberately not in this list).
 */
export const caseStudies: CaseStudy[] = [kenchanRamen, fundingSolutions, lendzi, disco, nutrisnap];

export const publishedCaseStudies = caseStudies.filter((c) => c.status === "published");

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** Link for a case study, or null while it's still coming soon. */
export const caseStudyHref = (c: CaseStudy) =>
  c.status === "published" ? `/work/${c.slug}` : null;
