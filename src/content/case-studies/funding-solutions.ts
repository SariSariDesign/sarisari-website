import type { CaseStudy } from "./types";

/**
 * Funding Solutions dashboard — ported from 05 artifacts/10 marketing/case/case study.pdf
 * and FS.pdf (Draft 1). The parent brokerage is deliberately unnamed and no Lendzi work
 * is included. No measured outcomes yet: the dashboard is in development, so stats are
 * scope, not results.
 */
export const fundingSolutions: CaseStudy = {
  slug: "funding-solutions",
  status: "published",
  client: "Funding Solutions",
  card: {
    productType: "Fintech",
    helpedWith: ["Dashboard UX", "Product architecture", "Design system"],
    outcome: "A self-serve lending dashboard designed from the ground up in 90 days.",
    image: "/work/funding-solutions.webp",
  },
  page: {
    title: "Turning high-stakes loan ops into a self-serve lending pipeline",
    byline: "Client: Funding Solutions",
    tags: ["0→1 product design", "UX strategy", "Information architecture", "Design system"],
    heroImage: "/work/funding-solutions-hero.webp",
    heroStats: [
      { value: "30+", label: "screens designed" },
      { value: "10+", label: "loan types supported" },
      { value: "90 days", label: "from discovery to dev-ready handoff" },
    ],
    intro:
      "Funding Solutions is the new customer-facing lending arm of a fast-growing U.S. small-business loan brokerage. They came to us for a self-serve platform that could generate and qualify leads without adding to the sales floor.",
    blocks: [
      {
        kind: "section",
        label: "Inquiry",
        title: "The process ran on loan officers. The product had to run on its own.",
        paragraphs: [
          "Deals moved through calls, emails, PDFs and spreadsheets, and the know-how lived with the loan officers who ran them. It worked, but every new loan needed a person to move it forward.",
          "Funding Solutions needed one coherent product that could take a business owner from first form to funding, across many loan products and lenders.",
        ],
      },
      {
        kind: "split",
        title: "We weren't improving UX. We were designing the first digital version of the business.",
        paragraphs: [
          "Lending is tightly regulated and there was no internal documentation, so we reconstructed how underwriting actually worked before designing a screen.",
          "We interviewed key players and mapped the full loan lifecycle, from lead to funding: what triggers each status change, what underwriting needs, and which data objects exist (application, offer, stipulation, booster, document, profile).",
        ],
      },
      { kind: "figure", ratio: "2400x1740", caption: "Application history: every application, status and next step in one place.", image: "/work/fs-app-history.webp" },
      {
        kind: "section",
        label: "Approach",
        title: "Four pillars, built so new loan products plug in without a redesign.",
        paragraphs: [
          "• Applications: one hub for progress, status, documents and activity.\n• Offers: side-by-side comparison across loan products.\n• Eligibility tools: action plans that turn a \"no\" into \"not yet.\"\n• Profile and documents: share information once, securely.",
        ],
      },
      { kind: "step", title: "1. Systems first.", paragraphs: ["We defined operational logic where none was written down and shaped the IA so the product reads as one experience, not separate tools."] },
      { kind: "step", title: "2. Design for unknowns.", paragraphs: ["Modular components flex across 10+ loan types, user segments and future features, so the platform grows without starting over."] },
      { kind: "step", title: "3. Lower the load on stressed borrowers.", paragraphs: ["Progressive disclosure, plain language and save-and-resume make a high-stakes application feel like a clear path."] },
      { kind: "figure", ratio: "2400x2916", caption: "Offer comparison: decision-critical terms up front, full details one tap deeper.", image: "/work/fs-offers.webp" },
      {
        kind: "section",
        label: "Handoff",
        title: "Designed for build, down to the states and triggers.",
        paragraphs: [
          "Smart offer cards, an application status system and an offer-details layer share one data model, with every state and trigger mapped for engineering.",
          "We delivered responsive screens, a reusable component library, documented logic and a handoff guide, all in one Figma package.",
        ],
      },
      {
        kind: "split",
        title: "A foundation for the roadmap.",
        paragraphs: [
          "Funding Solutions is in active development. Automated underwriting, post-funding servicing and a business tools marketplace are next on the roadmap, all built on this foundation.",
        ],
      },
    ],
  },
};
