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
    title: "The product design team your startup can't hire yet",
    description:
      "Sari Sari turns the users you worked hard to get into regulars. Senior product design for Seed to Series A founders.",
  },
  hero: {
    // First line renders in the italic serif, second in the sans (Superside pattern).
    lead: "The product design team",
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
    // Built from what clients say we did for them (approved testimonials).
    eyebrow: "What founders hire us for",
    headline: "Unblocked. Clear. Proven.",
    items: [
      {
        title: "Unblock your roadmap, fast",
        body: "We pick up the work that's stuck and ship it quickly, without cutting corners on quality.",
        quote: "You guys unblocked a huge work stream so quickly and efficiently.",
        who: "Eris Hanson-Cooper, Founder & CEO, Disco",
      },
      {
        title: "Know exactly what's broken",
        body: "We research with your real users and turn \"something feels off\" into a clear list of what to fix first.",
        quote: "The things I knew felt off but couldn't articulate this clearly. Your diagnostic gave me a clear punch list to work from.",
        who: "Michael Campbell, CEO, Signal Verified",
      },
      {
        title: "Test it before you build it",
        body: "We turn feature requests into quick tests, so you only build what earns its keep.",
        quote: "They reframed it into a validation question and shipped proof in a day.",
        who: "Jed G., Cofounder, Kocah",
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
    headline: "Freelancer? In-house hire? Self-serve? Neither.",
    columns: ["Sari Sari", "Freelancer", "In-house hire", "Self-serve tools"],
    rows: [
      { label: "Finds why users leave, with your real users", values: ["yes", "some", "some", "no"] },
      { label: "Strategy and design in one team", values: ["yes", "some", "yes", "no"] },
      { label: "Designs and builds", values: ["yes", "some", "no", "some"] },
      { label: `Starts within ${terms.startLeadTime}`, values: ["yes", "yes", "no", "yes"] },
      { label: "Prices you can see upfront", values: ["yes", "some", "no", "yes"] },
      { label: "Money-back guarantee", values: ["yes", "no", "no", "some"] },
      { label: "Scale up or down any month", values: ["yes", "some", "no", "yes"] },
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
