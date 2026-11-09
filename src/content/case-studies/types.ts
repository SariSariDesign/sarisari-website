/**
 * Case-study content model. One file per case study in this folder, registered in
 * `index.ts`; the `/work/[slug]` template renders any of them and the homepage Case
 * Studies section renders their cards. Adding a case study = add a file + one line in
 * the index (a CMS can later produce the same shape).
 */

export type CaseStudyStat = { value: string; label: string };

export type CaseStudyFigure = { ratio: string; caption: string; image?: string };

/**
 * A block with a `label` opens a new chapter: the label becomes the chapter's eyebrow in
 * the left rail and its tick in the page's tick nav. Keep labels to one or two words.
 */
export type CaseStudyBlock =
  | { kind: "section"; label?: string; title: string; paragraphs: string[] }
  | { kind: "step"; title: string; paragraphs: string[] }
  /** `span`: "offset" c1–c6 (default), "body" c4–c12, "full" c1–c12. */
  | { kind: "quote"; quote: string; name: string; role: string; span?: "offset" | "full" | "body" }
  | { kind: "stats"; big?: boolean; stats: CaseStudyStat[] }
  /** `span`: "body" c4–c12 (default) or "full" c1–c12. */
  | ({ kind: "figure"; span?: "body" | "full" } & CaseStudyFigure)
  /** 2–3 images side by side. `span`: "full" c1–c12 (default) or "body" c4–c12. */
  | { kind: "figure-row"; span?: "body" | "full"; figures: CaseStudyFigure[] }
  | { kind: "split"; label?: string; title: string; paragraphs: string[] };

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
