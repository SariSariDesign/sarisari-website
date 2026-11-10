import { BOOKING_URL, terms } from "./site";

/**
 * Google Ads landing page (/start). Follows Superside's ad-page pattern and voice
 * (confident, punchy, benefit-first) with SSD's strategy: turn the users founders
 * worked hard to get into regulars; senior strategic design they can't hire yet.
 * Prices stay visible because the ads test pricing. Main CTA is the general
 * 30-min call; each offer card keeps its own tracked booking link.
 */
export const squeeze = {
  meta: {
    title: "The senior design team your startup can't hire yet",
    description:
      "Sari Sari turns the users you worked hard to get into regulars. Senior product design for Seed to Series A founders.",
  },
  hero: {
    // First line renders in the italic serif, second in the sans (Superside pattern).
    lead: "The senior design team",
    rest: "your startup can't hire yet",
    subhead:
      "We turn the users you worked hard to get into regulars. Find where they drop off, fix it, ship it.",
    cta: { label: "Book a call", href: BOOKING_URL },
  },
  logosLine: "Trusted by founder-led teams in health, fintech and commerce",
  intro: {
    eyebrow: "You built fast. Now make it stick.",
    headline: "Your users found you. Now give them a reason to stay.",
    body: "You shipped fast, often with AI. Now people sign up, poke around and drift away, and nobody on the team can say why. We find exactly where your product loses them and redesign those moments so they come back.",
    cta: { label: "Book a call", href: BOOKING_URL },
  },
  flex: {
    eyebrow: "Made for founders",
    headline: "Senior. Strategic. Hands-on.",
    items: [
      {
        title: "Senior-led, start to finish",
        body: "15+ years designing products. Patti directs every project and Zach runs the engagement. No juniors learning on your product.",
      },
      {
        title: "Strategy before screens",
        body: "Anyone can generate screens now. We decide what to build and why, and test it with your real users before you build it.",
      },
      {
        title: "We ship the fix",
        body: `We design and build, or work hand in hand with your developers. Most teams start within ${terms.startLeadTime}.`,
      },
    ],
  },
  numbers: {
    eyebrow: "Success in numbers",
    headline: "Results you can count",
    items: [
      { value: "37%", label: "of Kenchan's digital revenue came from a feature we designed" },
      { value: "13", label: "founder-led teams served across health, fintech and commerce" },
      { value: "15+", label: "years designing products people come back to" },
    ],
  },
  versus: {
    eyebrow: "Sari Sari vs. the alternatives",
    headline: "A full-time hire? An AI tool? Neither.",
    columns: ["Sari Sari", "Full-time hire", "Freelancer", "AI tools"],
    rows: [
      { label: "Senior product judgment", values: ["yes", "yes", "some", "no"] },
      { label: `Starts within ${terms.startLeadTime}`, values: ["yes", "no", "yes", "yes"] },
      { label: "Tests with your real users", values: ["yes", "some", "some", "no"] },
      { label: "Designs and builds", values: ["yes", "no", "some", "some"] },
      { label: "Prices you can see upfront", values: ["yes", "no", "some", "yes"] },
    ] as { label: string; values: ("yes" | "some" | "no")[] }[],
  },
  why: {
    eyebrow: "No, we're not a pixel factory.",
    headline: "Why Sari Sari?",
    items: [
      {
        label: "Strategic",
        title: "Built to keep users",
        body: "We design around the moments that decide whether people stay: signup, the first session, the reason to come back.",
      },
      {
        label: "Human",
        title: "Taste AI can't fake",
        body: "Tools can generate screens. They can't sit with your users, weigh trade-offs or tell you what to cut.",
      },
      {
        label: "Insightful",
        title: "Start small or go all in",
        body: "Start with a $1,500 Audit, run a 90-day project or keep us on as your design partner. Your call.",
      },
      {
        label: "Bold",
        title: "Your first month, guaranteed",
        body: "Not happy after Month 1 of Design+? We refund it in full and you walk away.",
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
