import {
  AUDIT_BOOKING_URL,
  BOOKING_URL,
  DESIGN_PARTNER_BOOKING_URL,
  DESIGN_PLUS_BOOKING_URL,
  DIAGNOSTIC_BOOKING_URL,
  terms,
} from "./site";
import type { OfferCard } from "@/components/OfferGrid";

/**
 * Google Ads landing page (/start). Order: promise → approach → proof → benefits →
 * vs. alternatives → prices → free Scorecard → FAQ. Prices stay visible because the
 * ads test pricing. Main CTA is the general 30-min call; each offer keeps its own
 * tracked booking link.
 */
export const squeeze = {
  meta: {
    title: "The design team that turns signups into regulars",
    description:
      "We find where your users drop off, design the fix and ship it, so the ones you worked hard to get stick around.",
  },
  hero: {
    // First line renders in the italic serif, second in the sans.
    lead: "The design team",
    rest: "that turns signups into regulars",
    subhead:
      "We find where your users drop off, design the fix and ship it, so the ones you worked hard to get stick around.",
    cta: { label: "Book a call", href: BOOKING_URL },
    secondary: { label: "Pricing", href: "#pricing" },
  },
  logosLine: "Trusted by founder-led teams in health, fintech and commerce",
  approach: {
    eyebrow: "Our approach",
    headline: "How we keep your users",
    steps: [
      {
        title: "Find where they leave",
        body: "We walk your product like a new user and test it with real people. You get a clear list of what's costing you users, in order.",
      },
      {
        title: "Design the fix",
        body: "We redesign the screens and flows that lose people, then test them before anything gets built.",
      },
      {
        title: "Ship it",
        body: "We build it with you, or hand your developers specs they can run with.",
      },
    ],
  },
  results: {
    // One statement per approved testimonial, backed by that quote.
    eyebrow: "Results",
    headline: "What founders hire us for",
    items: [
      {
        statement: "Unblock your roadmap and ship in weeks",
        quote: "You guys unblocked a huge work stream so quickly and efficiently.",
        who: "Eris Hanson-Cooper, Founder & CEO, Disco",
      },
      {
        statement: "Talk to real users to turn “something's off” into a clear list of action items",
        quote: "The things I knew felt off but couldn't articulate this clearly. Your diagnostic gave me a clear punch list to work from.",
        who: "Michael Campbell, CEO, Signal Verified",
      },
      {
        statement: "Test ideas before you build them, and find what actually makes money",
        quote: "They reframed it into a validation question and shipped proof in a day. That bundle test went on to become one of the most reliable revenue levers in our digital channel.",
        who: "Jed G., Cofounder, Kocah",
      },
      {
        statement: "Get every screen reviewed, with fixes you can test right away",
        quote: "They not only helped tear down every single screen, but also suggested helpful recommendations which were simple to test.",
        who: "Nora Rabah Rodden, Founder, Nervana",
      },
      {
        statement: "Look like the company you're becoming",
        quote: "The appearance of my company now is just so much more professional thanks to the amazing talents of the Sari Sari designers…",
        who: "Jherray Babida, President, Social Wine & Spirit",
      },
    ],
  },
  numbers: {
    eyebrow: "Success in numbers",
    headline: "Results you can count",
    items: [
      { value: "$48M+", label: "raised by the founders we've designed for, and counting" },
      { value: "37%", label: "of Kenchan's digital revenue came from one feature we designed" },
      { value: "1 day", label: "from idea to a live test of a new revenue feature" },
    ],
  },
  why: {
    eyebrow: "Benefits",
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
  pricing: {
    eyebrow: "Pricing",
    headline: "Pick where to start",
    offers: [
      {
        id: "offer-audit",
        name: "The Audit",
        summary: "Find where users leave in any single flow.",
        price: "$1,500",
        cta: { label: "Book a call", href: AUDIT_BOOKING_URL },
        features: ["7 days", "Activation Scorecard", "Screen-by-screen teardown"],
      },
      {
        id: "offer-diagnostic",
        name: "The Diagnostic",
        summary: "Find the biggest problem in a flow and redesign it.",
        price: "$6,000",
        cta: { label: "Book a call", href: DIAGNOSTIC_BOOKING_URL },
        features: ["21 days", "Scorecard and teardown", "Redesigned prototype", "Validation guide", "90-day roadmap"],
      },
      {
        id: "offer-design-plus",
        name: "Design+",
        summary: "Design and ship one defined project in 90 days.",
        price: "$8,000+",
        period: "/ month",
        featured: true,
        cta: { label: "Book a call", href: DESIGN_PLUS_BOOKING_URL },
        features: ["One defined project", "Shipped in 90 days", "We build it, or guide your developers", "3-month minimum"],
        note: "Not happy after Month 1? We refund it in full.",
      },
      {
        id: "offer-design-partner",
        name: "The Design Partner",
        summary: "Ongoing design and engineering on an open roadmap.",
        price: "Let's talk",
        cta: { label: "Book a call", href: DESIGN_PARTNER_BOOKING_URL },
        features: ["Design and engineering team", "Open roadmap", `Starts within ${terms.startLeadTime}`, "Cancel anytime"],
      },
    ] satisfies OfferCard[],
  },
  scorecard: {
    eyebrow: "Free",
    headline: "Not ready to talk? Get a free Scorecard.",
    body: "Drop in your URL. We'll email you the top 5 things keeping users from converting.",
  },
  // FAQ items left off this page (not relevant to ad visitors).
  faqHide: ["Does the Diagnostic fee count toward Design+?"],
  cta: { label: "Book a call", href: BOOKING_URL },
};
