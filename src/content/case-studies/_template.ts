import type { CaseStudy } from "./types";

/**
 * Case-study template, modelled on `kenchan-ramen.ts`. NOT registered in `index.ts`, so it
 * never publishes. To add a study:
 *   1. Copy this file to `<slug>.ts`, rename the export, set `slug` + `client`.
 *   2. Fill `card` (shows on /work and the homepage straight away as "coming soon").
 *   3. Fill `page`: hero stats, intro, then blocks in Kenchan's rhythm
 *      (section → figure → stats → steps → quote → section → split → big stats).
 *   4. Add it to the list in `index.ts`.
 *   5. When the copy and images are final, set `status: "published"` — that creates /work/<slug>.
 * Images go in `public/work/<slug>-*.webp`.
 */
export const caseStudyTemplate: CaseStudy = {
  slug: "template",
  status: "coming-soon",
  client: "Client name",
  card: {
    productType: null, // e.g. "Ecommerce", "Fintech"
    helpedWith: [], // e.g. ["Product strategy", "Conversion"]
    outcome: null, // one line with the number, e.g. "A bundle test now drives 37% of revenue."
    image: null, // "/work/<slug>.webp"
  },
  page: {
    title: "Headline that names the result",
    byline: "Client: Name · Partner: Name",
    tags: ["Strategy", "Product Design"],
    heroImage: null, // "/work/<slug>-hero.webp"
    heroStats: [
      { value: "00%", label: "headline metric" },
      { value: "+0%", label: "second metric" },
      { value: "0 wks", label: "time to result" },
    ],
    intro: "Who the client is, what they came to us for, and what it turned into.",
    blocks: [
      { kind: "section", label: "Inquiry", title: "What the client asked for.", paragraphs: ["Context."] },
      { kind: "section", title: "The tension or insight.", paragraphs: ["Why the obvious path was wrong."] },
      { kind: "section", title: "How we reframed the project.", paragraphs: ["The new objective."] },
      { kind: "figure", ratio: "774x516", caption: "Fig 01 — caption" },
      { kind: "stats", stats: [{ value: "00%", label: "early signal" }] },
      { kind: "step", title: "1. First move.", paragraphs: ["What we did and why."] },
      { kind: "step", title: "2. Second move.", paragraphs: ["What we did and why."] },
      { kind: "quote", quote: "Client quote.", name: "Name", role: "Role, Company" },
      { kind: "split", title: "From test to lasting result.", paragraphs: ["The outcome.", "Why it worked."] },
      { kind: "stats", big: true, stats: [{ value: "00%", label: "final metric" }] },
    ],
  },
};
