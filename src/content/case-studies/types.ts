/**
 * Case-study content model. One file per case study in this folder, registered in
 * `index.ts`; the `/work/[slug]` template renders any of them and the homepage Case
 * Studies section renders their cards. Adding a case study = add a file + one line in
 * the index (a CMS can later produce the same shape).
 */

export type CaseStudyStat = { value: string; label: string };

/** `video`: muted looping MP4; `image` doubles as its poster (and the reduced-motion still). */
export type CaseStudyFigure = { ratio: string; caption: string; image?: string; video?: string };

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
  | { kind: "split"; label?: string; title: string; paragraphs: string[] }
  /** Boxed list (e.g. "Key takeaways for founders"): bold-ish lead + one line each. */
  | { kind: "callout"; title: string; items: { lead: string; text: string }[] }
  /** Two or three short points side by side on desktop (e.g. competing concepts). */
  | { kind: "compare"; items: { title: string; text: string }[] };


export type CtaContent = {
  headline: string;
  subhead: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

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
    /** 16:9 image for the featured (first, full-width) card on /work; falls back to the hero. */
    wideImage?: string;
  };
  /** Full-page content; required once `status` is "published". */
  page?: {
    title: string;
    byline: string;
    tags: string[];
    heroImage: string | null;
    /** Hero frame as "WxH" (e.g. "1912x800"); defaults to 16:9. */
    heroRatio?: string;
    heroStats: CaseStudyStat[];
    intro: string;
    blocks: CaseStudyBlock[];
    /** Overrides the site-wide closing CTA band so it speaks to this study's problem. */
    cta?: CtaContent;
  };
};
