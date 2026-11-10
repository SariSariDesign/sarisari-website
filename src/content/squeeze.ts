import { BOOKING_URL } from "./site";

/**
 * Google Ads landing page (/start). Strategy: SSD Website UX Strategy doc, tab
 * "05 Squeeze page". The founder is the main character: each section names their
 * pain in their words, then says how SSD fixes it. Prices stay visible because the
 * ads test pricing. Main CTA is the general 30-min call; each offer card keeps its
 * own tracked booking link.
 */
export const squeeze = {
  meta: {
    title: "Product design that keeps your users",
    description:
      "Users sign up, then disappear? Sari Sari finds where your product loses people, redesigns those moments and helps you ship the fix.",
  },
  hero: {
    eyebrow: "Product design for Seed to Series A founders",
    headline: "Users sign up. Then they disappear. We fix that.",
    subhead:
      "You worked hard to get those users. We find exactly where your product loses them, redesign those moments and help you ship the fix.",
    cta: { label: "Book a call", href: BOOKING_URL },
    secondary: { label: "See pricing", href: "#pricing" },
  },
  pains: {
    eyebrow: "Sound familiar?",
    headline: "You've got the users. Your product isn't keeping them.",
    items: [
      {
        quote: "We get signups, but nobody sticks around.",
        help: "We find the exact steps where people quit and redesign them.",
        note: "The average app loses 77% of new users within 3 days.*",
      },
      {
        quote: "We're going off vibes.",
        help: "We show you what's costing you users and what to fix first, backed by research instead of guesses.",
      },
      {
        quote: "It works, but it looks AI-made.",
        help: "We give your product the clarity and craft people trust.",
      },
      {
        quote: "There's no senior designer on the team.",
        help: "You get a senior product design team without the hire.",
      },
    ],
    source: "*Quettra data via Andrew Chen (2015, Android apps).",
  },
  stats: [
    { value: "37%", label: "of Kenchan's digital revenue came from a feature we designed" },
    { value: "13", label: "teams across health, fintech and commerce" },
    { value: "15+", label: "years designing products people come back to" },
  ],
  how: {
    eyebrow: "How we fix it",
    headline: "Find it. Fix it. Ship it.",
    steps: [
      {
        title: "Find where you lose them",
        body: "We walk your product like a new user and score every step. You see exactly where people drop and why.",
      },
      {
        title: "Fix the moments that matter",
        body: "We redesign the screens and flows that lose people, then test them with real users before you build.",
      },
      {
        title: "Ship it",
        body: "We build it with you, or hand your developers a roadmap and specs they can run with.",
      },
    ],
  },
  scorecard: {
    eyebrow: "Not ready to talk?",
    headline: "See where your users drop off, free",
  },
  faqExtra: {
    q: "Do you run ads?",
    a: "No. We design the product so the users you bring in stay.",
  },
  cta: { label: "Book a call", href: BOOKING_URL },
};
