import { BOOKING_URL } from "./site";

/**
 * Google Ads landing page (/start). Strategy: SSD Website UX Strategy doc, tab
 * "05 Squeeze page" (Steps 1–5). One storyline for the get-users and activation
 * searchers; prices stay visible because the ads test pricing. Main CTA is the
 * general 30-min call; each offer card keeps its own tracked booking link.
 */
export const squeeze = {
  meta: {
    title: "Product design that keeps your users",
    description:
      "Senior-led product design for Seed to Series A founders. We find where users leave, design the fix and build it.",
  },
  hero: {
    eyebrow: "For Seed to Series A founders",
    headline: "Design that turns users into regulars.",
    subhead:
      "You worked hard to get those users. We find where they leave, design the fix and build it.",
    cta: { label: "Book a call", href: BOOKING_URL },
  },
  work: {
    eyebrow: "Our work",
    headline: "Products people come back to",
  },
  problem: {
    eyebrow: "Why users leave",
    headline: "The average app loses 77% of new users within 3 days.",
    body: "You can see them leave. You can't see why. We find where yours drop off, then design and build the fix.",
    source: "Source: Quettra data via Andrew Chen (2015, Android apps).",
  },
  how: {
    eyebrow: "How we work",
    headline: "Senior judgment, start to finish",
    items: [
      {
        title: "Find where users leave",
        body: "We review your product the way a new user meets it and pinpoint where people stall.",
      },
      {
        title: "Design the fix",
        body: "Clear flows and screens, tested with real users before anything ships.",
      },
      {
        title: "Build it, or guide your developers",
        body: "We design and build, or work hand in hand with your team.",
      },
      {
        title: "Senior-led",
        body: "Patti directs every project; Zach runs the engagement. No hand-offs to juniors.",
      },
    ],
  },
  scorecard: {
    eyebrow: "Not ready to talk?",
    headline: "Start with a free Scorecard",
  },
  faqExtra: {
    q: "Do you run ads?",
    a: "No. We design the product so the users you bring in stay.",
  },
  cta: { label: "Book a call", href: BOOKING_URL },
};
