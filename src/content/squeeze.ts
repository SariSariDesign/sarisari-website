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
        statement: "Turn “something's off” into a clear to-do list, backed by real users",
        quote: "The things I knew felt off but couldn't articulate this clearly. Your diagnostic gave me a clear punch list to work from.",
        who: "Michael Campbell, CEO, Signal Verified",
      },
      {
        statement: "Prove ideas work before you build them",
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
      { value: "1 hour", label: "from launch to live data proving Kenchan's new feature worked" },
    ],
  },
  why: {
    eyebrow: "Benefits",
    headline: "Why Sari Sari?",
    items: [
      {
        icon: "arrows-clockwise",
        label: "Strategic",
        title: "Built to keep users",
        body: "We design around the moments that decide whether people stay: signup, the first session, the reason to come back.",
      },
      {
        icon: "hand-heart",
        label: "Human",
        title: "Taste AI can't fake",
        body: "Tools can generate screens. They can't sit with your users, weigh trade-offs or tell you what to cut.",
      },
      {
        icon: "trend-up",
        label: "Insightful",
        title: "Start small or go all in",
        body: "Start with a $1,500 Audit, run a 90-day project or keep us on as your design partner. Your call.",
      },
      {
        icon: "shield-check",
        label: "Bold",
        title: "Your first month, guaranteed",
        body: "Not happy after Month 1 of Design+? We refund it in full and you walk away.",
      },
    ],
  },
  versus: {
    eyebrow: "Sari Sari vs. the alternatives",
    headline: "Freelancer? Agency? In-house hire? Neither.",
    columns: ["Sari Sari", "Freelancer", "Agency", "In-house hire", "DIY tools"],
    rows: [
      { label: "Finds why users drop off", values: ["✓ Tested with your real users", "If you scope it", "Usually a paid discovery phase", "Once they're up to speed", "You read the data yourself"] },
      { label: "Strategy, design and build", values: ["✓ One team", "Usually design only", "✓", "One person's skill set", "—"] },
      { label: "Start date", values: ["As fast as 3 days", "Varies", "After scoping and contracts", "Months to hire", "Today"] },
      { label: "Price", values: ["Public, from $1,500", "Hourly, varies", "Many start at $50K+", "Salary, equity, benefits", "Free to a % of revenue"] },
      { label: "Smallest first step", values: ["Free 2-min Scorecard, or a 7-day Audit", "A paid project", "Discovery phase", "A full-time hire", "Setup and your own time"] },
      { label: "Commitment", values: ["From 7 days. Retainers cancel anytime.", "Per project", "Fixed contract", "Full-time", "Monthly"] },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    headline: "Pick where to start",
    offers: [
      {
        id: "offer-audit",
        name: "The Audit",
        summary: "Find where users leave in any single flow, and why.",
        price: "$1,500",
        cta: { label: "Book a call", href: AUDIT_BOOKING_URL },
        features: ["7 days", "UX scorecard", "Screen-by-screen teardown"],
      },
      {
        id: "offer-diagnostic",
        name: "The Diagnostic",
        summary: "Redesign the biggest leak in your flow and get a clear 90-day plan for the rest.",
        price: "$6,000",
        cta: { label: "Book a call", href: DIAGNOSTIC_BOOKING_URL },
        features: ["28 days", "UX scorecard", "Screen-by-screen teardown", "Redesigned prototype", "Usability testing guide", "90-day roadmap"],
      },
      {
        id: "offer-design-plus",
        name: "Design+",
        summary: "Hand us your biggest product project. We take it from plan to shipped in 90 days.",
        price: "$8,000+",
        period: "/ month",
        featured: true,
        cta: { label: "Book a call", href: DESIGN_PLUS_BOOKING_URL },
        features: ["Shipped in 90 days", "One launch, redesign or feature set, start to finish", "Clarity on what to build first, before anything gets built", "We build it, or guide your developers", "3-month minimum"],
        note: "Not happy after Month 1? We refund it in full.",
      },
      {
        id: "offer-design-partner",
        name: "The Design Partner",
        summary: "Ongoing design and dev on an open roadmap.",
        price: "Let's talk",
        cta: { label: "Book a call", href: DESIGN_PARTNER_BOOKING_URL },
        features: ["Design and engineering team", "Open roadmap", `Starts within ${terms.startLeadTime}`, "Cancel anytime"],
      },
    ] satisfies OfferCard[],
  },
  scorecard: {
    eyebrow: "Free · 2 minutes",
    headline: "Not ready to talk? Get a free Scorecard.",
    submitLabel: "Get Free Scorecard",
    body: "Drop in your URL. We'll email you the top 5 things keeping users from converting.",
  },
  // FAQ items left off this page (not relevant to ad visitors).
  faqHide: ["Does the Diagnostic fee count toward Design+?"],
  cta: { label: "Book a call", href: BOOKING_URL },
};
