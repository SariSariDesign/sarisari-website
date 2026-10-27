import type { CaseStudy } from "./types";

/** ⚠️ Drafted from _template.ts — fill `page`, then set status "published". */
export const nutrisnap: CaseStudy = {
  slug: "nutrisnap",
  status: "coming-soon",
  client: "NutriSnap",
  card: {
    productType: null, // ⚠️ product type
    helpedWith: [], // ⚠️ what we helped with
    outcome: null, // ⚠️ one-line outcome
    image: "/work/nutrisnap.webp",
  },
  page: {
    title: "⚠️ Headline that names the result",
    byline: "⚠️ Client: Name · Partner: Name",
    tags: ["⚠️ Strategy", "⚠️ Product Design"],
    heroImage: null, // "/work/<slug>-hero.webp"
    heroStats: [
      { value: "⚠️ 00%", label: "⚠️ headline metric" },
      { value: "⚠️ +0%", label: "⚠️ second metric" },
      { value: "⚠️ 0 wks", label: "⚠️ time to result" },
    ],
    intro: "⚠️ Who the client is, what they came to us for, and what it turned into.",
    blocks: [
      { kind: "section", label: "⚠️ Inquiry", title: "⚠️ What the client asked for.", paragraphs: ["⚠️ Context."] },
      { kind: "section", title: "⚠️ The tension or insight.", paragraphs: ["⚠️ Why the obvious path was wrong."] },
      { kind: "section", title: "⚠️ How we reframed the project.", paragraphs: ["⚠️ The new objective."] },
      { kind: "figure", ratio: "774x516", caption: "⚠️ Fig 01 — caption" },
      { kind: "stats", stats: [{ value: "⚠️ 00%", label: "⚠️ early signal" }] },
      { kind: "step", title: "⚠️ 1. First move.", paragraphs: ["⚠️ What we did and why."] },
      { kind: "step", title: "⚠️ 2. Second move.", paragraphs: ["⚠️ What we did and why."] },
      { kind: "quote", quote: "⚠️ Client quote.", name: "⚠️ Name", role: "⚠️ Role, Company" },
      { kind: "split", title: "⚠️ From test to lasting result.", paragraphs: ["⚠️ The outcome.", "⚠️ Why it worked."] },
      { kind: "stats", big: true, stats: [{ value: "⚠️ 00%", label: "⚠️ final metric" }] },
    ],
  },
};
