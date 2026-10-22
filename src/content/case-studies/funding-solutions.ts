import type { CaseStudy } from "./types";

/** ⚠️ Case study coming: convert the Figma version into `page`, then set status "published". */
export const fundingSolutions: CaseStudy = {
  slug: "funding-solutions",
  status: "coming-soon",
  client: "Funding Solutions",
  card: {
    productType: "Fintech",
    helpedWith: [], // ⚠️ e.g. "Dashboard UX", "Application flow"
    outcome: null, // ⚠️ one-line outcome
    image: "/work/funding-solutions.webp",
  },
};
