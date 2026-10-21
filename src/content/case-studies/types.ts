/**
 * Case-study content model. One file per case study in this folder, registered in
 * `index.ts`; the `/work/[slug]` template renders any of them and the homepage Case
 * Studies section renders their cards. Adding a case study = add a file + one line in
 * the index (a CMS can later produce the same shape).
 */

export type CaseStudyStat = { value: string; label: string };

export type CaseStudyFigure = { ratio: string; caption: string; image?: string };

export type CaseStudyBlock =
  | { kind: "section"; label?: string; title: string; paragraphs: string[] }
  | { kind: "step"; title: string; paragraphs: string[] }
  | { kind: "quote"; quote: string; name: string; role: string }
  | { kind: "stats"; big?: boolean; stats: CaseStudyStat[] }
  | ({ kind: "figure" } & CaseStudyFigure)
  | { kind: "figure-row"; figures: CaseStudyFigure[] }
  | { kind: "split"; title: string; paragraphs: string[] };

export type CaseStudy = {
  slug: string;
  /** `published` gets a page + linked card; `coming-soon` shows a card only. */
  status: "published" | "coming-soon";
  client: string;
  /** Card tags: the type of product, what we helped with, and a one-line outcome. */
  card: {
    productType: string | null;
    helpedWith: string[];
    outcome: string | null;
    image: string | null;
  };
  /** Full-page content; required once `status` is "published". */
  page?: {
    title: string;
    byline: string;
    tags: string[];
    heroImage: string | null;
    heroStats: CaseStudyStat[];
    intro: string;
    blocks: CaseStudyBlock[];
  };
};
