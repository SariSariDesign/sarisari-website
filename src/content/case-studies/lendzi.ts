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
    title: "Good design starts with the right diagnosis",
    byline: "Client: Lendzi",
    tags: ["Brand strategy", "Logo design", "A/B testing"],
    heroImage: "/work/lendzi-cover.webp",
    heroStats: [
      { value: "8", label: "competing brands on the listing page" },
      { value: "2", label: "concepts in an A/B test" },
      { value: "4–6 wks", label: "to a reliable signal" },
    ],
    intro:
      "When we do foundational identity work for early- and growth-stage companies, the AI question comes up constantly: should founders try the tools before hiring a studio? Probably, yeah, especially for exploration. But there's a specific moment when the tools stop being useful, and most founders don't recognize it until they've spent significant time on the wrong problem.",
    blocks: [
      {
        kind: "section",
        label: "Inquiry",
        title: "Lower-ranked competitors were getting more clicks.",
        paragraphs: [
          "Lendzi is a B2B financial services company competing with eight other brands on a third-party listing platform. Their instinct was that the logo wasn't pulling its weight: it's the single most visual component on their listing.",
          "So they ran it through AI tools, got a handful of directions, and couldn't evaluate them. Nothing felt clearly right, but they weren't sure what was wrong either. They had less clarity than when they started.",
        ],
      },
      {
        kind: "section",
        label: "Diagnosis",
        title: "The mark was blending into the listing page.",
        paragraphs: [
          "They wanted to move fast: skip the research and go straight to concepts. We aligned on speed but kept discovery and diagnosis. Without them, faster just means arriving at the wrong answer sooner.",
          "Discovery made the problem visible. Their mark shared visual weight, tonal range and energy with the listing page itself, so it read as part of the page. The competitors getting more clicks had higher-contrast lockups that punched through the page noise immediately.",
        ],
      },
      {
        kind: "split",
        title: "What the AI tools were missing.",
        paragraphs: [
          "The AI outputs were built against nothing: no competitive context, no constraints, no hypothesis about what wasn't working. Without a diagnosis, there's no way to tell if a concept is better, or what to try next if it fails.",
          "We're heavy AI users ourselves, and it compresses execution time significantly. Knowing what problem we're solving, what \"better\" means, and what we're betting on is still manual work. When you can generate options faster than you can evaluate them, that strategic layer matters more.",
        ],
      },
      {
        kind: "step",
        title: "Concept 1 is a bet on recognition.",
        paragraphs: [
          "A refinement of the original icon with more institutional weight and higher contrast. People who already know the brand see continuity and evolution, not a rebrand.",
        ],
      },
      {
        kind: "step",
        title: "Concept 2 is a bet on attention.",
        paragraphs: [
          "A new, higher-contrast lockup with a dynamic, directional element. It works better for cold audiences who don't know the brand at all.",
        ],
      },
      {
        kind: "section",
        label: "The test",
        title: "Every outcome tells them what to do next.",
        paragraphs: [
          "Both concepts ran as an A/B test on the listing platform, measured by popularity score (a proxy for clicks) over 4–6 weeks.",
          "Before this, the client had no way to define success and no next step if a concept failed. The diagnosis plus a well-structured test gives them both:",
          "• Concept 1 wins: the brand equity is real, and the execution needed stronger craft. Next: is contrast enough, or does the icon need to work harder?\n• Concept 2 wins: the old mark was doing negative work, and clarity beat continuity. Next: we can capture attention, but can the landing page convert?\n• Neither moves the needle: contrast and icon form may not be the levers, or the logo isn't the main variable. Next: what else is worth testing first?\n• Results get worse: the mark had more recognition value than the audit suggested. Stop touching the logo; the problem is upstream, likely platform score or positioning copy.",
        ],
      },
      {
        kind: "split",
        title: "The arrow is live.",
        paragraphs: [
          "The new arrow mark from Concept 2 is now live on Lendzi's main website.",
        ],
      },
      {
        kind: "split",
        title: "When to use AI tools, and when not to.",
        paragraphs: [
          "AI tools are great for rapid early exploration: options to react to, and fast execution once the direction is clear. They're much less useful for finding the problem, judging whether a direction solves it, or building a hypothesis you can test.",
          "If you're sitting on a handful of AI-generated concepts that all look fine and none feel right, that's a diagnosis problem.",
        ],
      },
    ],
  },
};
