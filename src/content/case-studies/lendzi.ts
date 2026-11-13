import { SCORECARD_URL } from "../site";
import type { CaseStudy } from "./types";

/**
 * Lendzi logo refresh — copy from Patti's "Good design starts with the right diagnosis"
 * (Oct 29). Cover is the animated lockup (public/work/lendzi-cover.mp4, poster .webp).
 * Lendzi didn't share final test numbers; the new arrow mark (Concept 2) is now live on
 * their main website.
 */
export const lendzi: CaseStudy = {
  slug: "lendzi",
  status: "published",
  client: "Lendzi",
  card: {
    productType: "Fintech",
    helpedWith: ["Brand identity", "A/B testing"],
    outcome: "Two logo concepts built on a clear diagnosis. The new arrow mark is now live.",
    image: "/work/lendzi-cover.webp",
  },
  page: {
    title: "Why AI couldn't fix a logo that was blending in",
    byline: "Client: Lendzi",
    tags: ["Brand strategy", "Logo design", "A/B testing"],
    heroImage: "/work/lendzi-cover.webp",
    heroStats: [
      { value: "8", label: "competing brands on the listing page" },
      { value: "2", label: "concepts in an A/B test" },
      { value: "4–6 wks", label: "to a reliable signal" },
    ],
    intro:
      "Lendzi's AI-generated logo options all looked fine, and none felt right. We found the problem first, then designed two concepts to test against it.",
    cta: {
      headline: "AI concepts that all look fine? Start with a diagnosis.",
      subhead:
        "AI tools are great for exploring and for moving fast once the direction is clear. We find the problem first, so you know which direction to build and how to tell if it worked.",
      primary: { label: "Book a call", href: "https://calendly.com/sarisari/30min" },
      secondary: { label: "Get Free Scorecard", href: SCORECARD_URL },
    },
    blocks: [
      {
        kind: "callout",
        title: "Outcome",
        items: [
          {
            lead: "The arrow is live.",
            text: "Concept 2 now leads Lendzi's main website: a mark built to stand out on a crowded listing page.",
          },
        ],
      },
      {
        kind: "section",
        label: "Inquiry",
        title: "Lower-ranked competitors were getting more clicks.",
        paragraphs: [
          "Lendzi competes with eight other brands on a third-party listing platform, where the logo is the most visual part of each listing. They'd tried AI tools for new directions, but with nothing to judge them against, they ended up with less clarity than they started with.",
        ],
      },
      {
        kind: "section",
        label: "Diagnosis",
        title: "The mark was blending in, and the AI had no way to know.",
        paragraphs: [
          "Lendzi's mark shared the listing page's visual weight and tonal range, so it read as part of the page, while the competitors winning clicks used high-contrast lockups that cut through. The AI concepts were built against none of that: no competitive context, no constraints, no hypothesis. We use AI heavily for execution, but finding the problem is still the work.",
        ],
      },
      {
        kind: "compare",
        items: [
          {
            title: "Concept 1 is a bet on recognition.",
            text: "A refined version of the original icon with more weight and contrast, so existing customers see an evolution, not a rebrand.",
          },
          {
            title: "Concept 2 is a bet on attention.",
            text: "A new high-contrast lockup with a directional arrow, built for cold audiences who don't know the brand yet.",
          },
        ],
      },
      {
        kind: "section",
        label: "The test",
        title: "Every outcome tells them what to do next.",
        paragraphs: [
          "Both concepts ran as an A/B test on the listing platform, measured by popularity score over 4–6 weeks. Each result points to a next step:",
          "• Concept 1 wins: the brand equity holds. Next, find out if contrast alone is enough.\n• Concept 2 wins: clarity beat continuity. Next, find out if the landing page converts.\n• No change: the logo may not be the lever. Next, test platform score or positioning.\n• Results drop: the original mark carried more recognition than expected. Leave it and look upstream.",
        ],
      },
      {
        kind: "figure",
        span: "full",
        ratio: "2600x1460",
        caption: "The Lendzi brand guide: logo variations, color and spacing for the new arrow mark.",
        image: "/work/lendzi-brand.webp",
      },
    ],
  },
};
