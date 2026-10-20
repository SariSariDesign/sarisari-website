/**
 * Site copy — the reviewable source of truth for the homepage, ported verbatim from
 * the Claude-Design comp (decoded to `.context/decoded-template.html`).
 * ⚠️ = drafted / placeholder, pending Zach/Patti sign-off · everything else is comp-verbatim.
 * Full narrative + follow-ups tracked in content/copy-deck.md.
 */

export const BOOKING_URL = "https://calendly.com/sarisari/30min";
export const DIAGNOSTIC_URL = "https://activation-diagnostic.sarisari.design/";
export const CONTACT_EMAIL = "hello@sarisari.design"; // ⚠️ confirm address
export const LINKEDIN_URL = "https://www.linkedin.com/company/sarisaridesign"; // ⚠️ confirm URL

/**
 * Engagement terms — the comp shipped these as [BRACKET] placeholders. Drafted below,
 * flagged ⚠️ until Zach/Patti confirm. Interpolated into pricing terms + FAQ answers.
 */
export const terms = {
  minimumEngagement: "3-month", // ⚠️ [MINIMUM_ENGAGEMENT]
  noticePeriod: "30 days", // ⚠️ [NOTICE_PERIOD]
  pauseHoldPeriod: "30 days", // ⚠️ [PAUSE_HOLD_PERIOD]
  startLeadTime: "two weeks", // ⚠️ [START_LEAD_TIME]
};

/** Footer-CTA availability line — ⚠️ [N] new client slots for [QUARTER]. */
export const clientSlots = { n: "2", quarter: "Q3 2026" }; // ⚠️ confirm

export const nav = {
  links: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
    { label: "FAQ", href: "/#faq" },
  ],
  cta: { label: "Book a Call", href: BOOKING_URL },
};

/**
 * Hero headline A/B/C — comp shipped an author-facing switcher; A is the production
 * default. B/C are sanctioned alternates (recorded in copy-deck). The headline renders
 * in the editorial italic serif; option C is a centered two-line pairing.
 */
export const hero = {
  headlineOptions: {
    A: { headline: "Let's build products your people need.", note: "A — the fractional play", centered: false },
    B: { headline: "We build products people use.", note: "B — quiet confidence", centered: false },
    C: {
      headline: "Products your people need. Experiences they come back to.",
      note: "C — on-brand pairing",
      centered: true,
    },
    D: { headline: "Design that turns sign ups into regulars", note: "D — the regulars play", centered: false },
  },
  activeHeadline: "D" as "A" | "B" | "C" | "D",
  subhead: "A product design studio that helps you acquire, convert, and retain more customers.",
  ctas: [
    { label: "Let's chat", href: BOOKING_URL, variant: "primary" as const },
  ],
  marquee: {
    label: "Trusted by 20+ global teams", // ⚠️ substantiate before launch
    // Real client marks (grey silhouettes in /public/logos, from the activation-diagnostic
    // set). `mark: null` renders the name as text. ⚠️ confirm/permission logos before launch.
    logos: [
      { name: "Lendzi", mark: "/logos/lendzi.png" },
      { name: "SignalVerified", mark: "/logos/signalverified.png" },
      { name: "Silk & Sonder", mark: null },
      { name: "Lions & Lambs", mark: "/logos/lionslambs.png" },
      { name: "Selfbook", mark: "/logos/selfbook.png" },
    ],
  },
};

export const services = {
  eyebrow: "",
  headline: "Your product got you here. We build what's next.",
  intro:
    "Whether you've just launched or you're preparing for the next raise, our design-led product team is aimed at the numbers that matter most: conversion, retention, activation, and satisfaction.",
  // ⚠️ Digital products / Marketing support / Branding bodies are drafted, pending sign-off.
  // Eight cards = two even shelves of four; Design systems restored from the original six.
  cards: [
    {
      n: "01",
      title: "Digital products",
      body: "From idea to launch: strategy, design, and build under one roof, aimed at the metric your next round depends on.",
    },
    {
      n: "02",
      title: "UX design",
      body: "Flows and wireframes for every state, so your engineers stop guessing and your funnel stops leaking.",
    },
    {
      n: "03",
      title: "UI design",
      body: "Screens that make a two-year-old product look like the company you've become.",
    },
    {
      n: "04",
      title: "Design systems",
      body: "A component library and tokens your team assembles from, so new features stop being redesigns.",
    },
    {
      n: "05",
      title: "User testing & research",
      body: "We put your flows in front of real users and come back with the reason they stall, not a deck of opinions.",
    },
    {
      n: "06",
      title: "Marketing support",
      body: "Landing pages, launch assets, and site updates that match the product, so growth doesn't wait on a separate agency.",
    },
    {
      n: "07",
      title: "Branding",
      body: "Type, color, and voice that grow with you, so the brand keeps pace with the product.",
    },
    {
      n: "08",
      title: "Front-end development",
      body: "We ship the front-end ourselves. What we design is what goes live, on your stack.",
    },
  ],
};

export type CaseStudy = {
  sector: string;
  client: string;
  problem: string;
  approach: string;
  metric: string;
  metricLabel: string;
  stats: { value: string; label: string }[];
  testimonial: { quote: string; attribution: string } | null;
  href: string;
};

export type RegularCard = {
  client: string;
  /** "case" = a case-study card with copy; "reference" = an image on the gallery wall. */
  kind: "case" | "reference";
  /** Project types, shown as tags on case cards (e.g. "Ecommerce", "Conversion"). */
  types: string[];
  /** One to two sentences on the impact. null = case not yet authored. */
  impact: string | null;
  href: string | null;
  /** Client-work image; null renders the hatch placeholder. */
  image: string | null;
  /** Print aspect ratio (CSS `aspect-ratio`), kept identical while hanging and landed. */
  aspect: string;
};

export const work = {
  eyebrow: "",
  headline: "Our Regulars",
  // Six portfolio pieces hang in the hero like stock in a sari-sari store window, then
  // fall into place on scroll: case studies into the case row, references onto the
  // gallery wall beneath it. ⚠️ Only Kenchan is authored; Funding Solutions + GenWell
  // case studies are coming. Kenchan + Funding Solutions shots are from the old Webflow
  // site; NutriSnap is a supplied composite; GenWell (unbranded version), Lendzi and the
  // sixth piece still need images. Do not invent impact copy.
  regulars: [
    {
      client: "Kenchan Ramen",
      kind: "case",
      types: ["Ecommerce", "Conversion"],
      impact:
        "We tested a bundle offer in an afternoon instead of a six-week build. Bundles now drive 37% of digital revenue.",
      href: "/work/kenchan-ramen",
      image: "/work/kenchan-ramen.webp",
      aspect: "4/3",
    },
    {
      client: "Funding Solutions",
      kind: "case",
      types: ["Fintech"],
      impact: null,
      href: null,
      image: "/work/funding-solutions.webp",
      aspect: "4/3",
    },
    {
      client: "GenWell",
      kind: "case",
      types: [], // ⚠️ project types
      impact: null,
      href: null,
      image: null, // ⚠️ unbranded version pending
      aspect: "4/3",
    },
    {
      client: "Lendzi",
      kind: "reference",
      types: [],
      impact: null,
      href: null,
      image: null,
      aspect: "3/2",
    },
    {
      client: "NutriSnap",
      kind: "reference",
      types: [],
      impact: null,
      href: null,
      image: "/work/nutrisnap.webp",
      aspect: "6/7",
    },
    {
      client: "Portfolio piece", // ⚠️ sixth piece TBD
      kind: "reference",
      types: [],
      impact: null,
      href: null,
      image: null,
      aspect: "1/1",
    },
  ] satisfies RegularCard[],
  cases: [
    {
      sector: "DTC food · Shopify",
      client: "Kenchan Ramen",
      problem:
        "The founder wanted a competitor's custom bundle builder: a $13K, six-to-eight-week build, with no proof their customers bundled at all.",
      approach:
        "We reframed it from shipping a feature to testing the behavior: native Shopify discounts, one UI surface, a schema their operators could edit. Live the same afternoon.",
      metric: "37%",
      metricLabel: "of digital revenue",
      stats: [
        { value: "+8.1%", label: "AOV lift YoY" },
        { value: "<1 hour", label: "To first conversion" },
        { value: "711", label: "Bundle redemptions" },
      ],
      testimonial: {
        quote:
          "They reframed a feature request into a validation question and shipped proof in a day. That bundle test became one of the most reliable revenue levers in our digital channel.",
        attribution: "Jed G., Kocah",
      },
      href: "/work/kenchan-ramen",
    },
  ] satisfies CaseStudy[],
};

export const process = {
  eyebrow: "How we work",
  headline: "A double diamond pointed at a metric.",
  intro:
    "We widen to find the real problem, narrow to the one worth solving, then do it again on the solution. Each phase is judged on whether the number moved, not on how the screens look.",
  steps: [
    {
      n: "01",
      title: "Discover",
      body: "We watch real users and read your funnel data until we can name the step where people drop off.",
      when: "Week 1",
    },
    {
      n: "02",
      title: "Define",
      body: "We pick one metric to move and agree what a win looks like before any design starts.",
      when: "Week 2",
    },
    {
      n: "03",
      title: "Design",
      body: "A working prototype in week three, tested with your users, narrowed to the version that performs.",
      when: "Weeks 3–6",
    },
    {
      n: "04",
      title: "Ship",
      body: "We build it, ship it, and read the numbers with you, then keep going on the next drop-off.",
      when: "Weeks 7+",
    },
  ],
};

export const why = {
  eyebrow: "Why Sari Sari?",
  headline: "Four options on your desk. Here's ours.",
  items: [
    {
      title: "Versus hiring a Head of Design.",
      body: "Six months to hire, $400K+ loaded, and one person still can't cover design and development. We're live in weeks, and we'll help you hand off to an in-house team when the time is right.",
    },
    {
      title: "Versus a dev shop.",
      body: "They build what they're told. Nobody there owns whether it converts. We bring the product judgment first, then write the code ourselves.",
    },
    {
      title: "Versus a brand agency.",
      body: "Beautiful decks, then a handoff cliff and an invoice for every revision. We ship working product, and we stay after launch.",
    },
    {
      title: "Versus patching it yourself.",
      body: "The most expensive option, because it never ends. Work out what one point of conversion is worth at your volume, then compare.",
    },
  ],
};

export const about = {
  eyebrow: "About",
  headline: "Your team",
  members: [
    {
      name: "Zach Chaco",
      role: "Chief Executive Officer",
      bio: "Producer, previously Meta and Disney.",
    },
    {
      name: "Patricia Capiral",
      role: "Chief Creative Officer",
      bio: "15+ years of product and brand design.",
    },
  ],
  // ⚠️ Only the Kenchan quote is real; `quote: null` renders a pending placeholder. Do not fabricate.
  testimonials: [
    {
      quote:
        "They reframed a feature request into a validation question and shipped proof in a day. That bundle test became one of the most reliable revenue levers in our digital channel.",
      attribution: "Jed G., Kocah",
    },
    { quote: null, attribution: "Client testimonial pending" },
    { quote: null, attribution: "Client testimonial pending" },
  ] as { quote: string | null; attribution: string }[],
  pullQuote: "A short shelf of things we do well, for people we know by name.",
  origin: "Named for the Filipino corner store whose owner knows every customer by name.",
};

export const pricing = {
  eyebrow: "Pricing",
  headline: "No guesswork. One price.",
  intro:
    "A monthly retainer as your embedded design and development team. If that's more than you're ready to commit to, there's a shorter way to try us.",
  tabs: {
    retainer: "One stop shop",
    diagnostic: "Single Project",
  },
  retainer: {
    label: "Ongoing Partnership",
    price: "$16,000",
    period: "/ month",
    description: "Product design expertise and one price, so you can move quickly.",
    terms: `Monthly, no long-term contract. ${terms.minimumEngagement} minimum engagement, ${terms.noticePeriod} notice to stop or pause.`,
    cta: { label: "Book an intro call", href: BOOKING_URL },
    features: [
      { title: "Parallel workstreams, not a queue.", body: "Research through front-end, on your top priorities." },
      { title: "A design system that scales.", body: "New features get assembled, not redesigned." },
      { title: "Roadmap partners, not order-takers.", body: "We help decide what to build next." },
      { title: "Senior people only.", body: "No rotating cast of contractors." },
      { title: "Zero status theater.", body: "We work inside your Slack, Figma, and tools." },
    ],
  },
  diagnostic: {
    tag: "Try us first",
    label: "Activation Diagnostic",
    price: "21 days",
    period: "/ $2,500",
    headline: "Not ready for the full retainer? Start with three weeks.",
    description:
      "We diagnose, redesign, and prototype your highest-impact flow. You end up with a working prototype, the reasons your users stall, and a prioritized roadmap, whether or not you keep us on.",
    cta: { label: "See the diagnostic", href: DIAGNOSTIC_URL },
    rows: [
      {
        title: "Week 1: where growth is actually leaking",
        body: "User sessions and funnel data, ending in the one step costing you the most.",
      },
      {
        title: "Weeks 2–3: a redesigned flow you can click",
        body: "A working prototype of the fix, tested with your users, ready for your engineers.",
      },
      {
        title: "Day 21: the roadmap, yours either way",
        body: "Prioritized next moves with the reasoning, so you can run them with us or without us.",
      },
    ],
  },
};

export const faq = {
  eyebrow: "FAQ",
  headline: "Questions for us?",
  items: [
    {
      q: "How soon can you start?",
      a: `Usually within ${terms.startLeadTime} of a signed agreement, and the diagnostic can start faster than a retainer. We hold a limited number of clients at once, so we'll give you the real date on the call.`,
    },
    {
      q: "What if it isn't working?",
      a: `You give ${terms.noticePeriod} notice and stop paying, with no wind-down fees or penalties. We'd rather part cleanly than hold a client who isn't getting value.`,
    },
    {
      q: "Who owns the IP and the files?",
      a: "You do, from the first invoice. Design files, code, research recordings. Everything lives in accounts you control, and it stays yours if we stop working together.",
    },
    {
      q: "Can we pause the retainer?",
      a: `Yes, with ${terms.noticePeriod} notice. Pausing holds your slot for ${terms.pauseHoldPeriod}; after that we may fill it and you'd rejoin when one opens.`,
    },
    {
      q: "What happens when we hire an in-house design lead?",
      a: "We help you hire them and hand over cleanly: files, systems, context. We'd rather be the bridge to your in-house team than the reason you never build one.",
    },
    {
      q: "What do we need ready before starting?",
      a: "A decision-maker who can join a weekly review, access to your analytics and customers, and one owner on your side for approvals. That's it, we handle the rest of the setup in week one.",
    },
    {
      q: "Do you only work with health and wellness companies?",
      a: "No. Much of our work has been there, because trust and retention are everything in that category, and those are the problems we're best at. Any growth-stage consumer software company with the same pressures is a fit.",
    },
  ],
};

export const footerCta = {
  headline: "Hand the product experience to someone senior.",
  subhead:
    "Thirty minutes on where growth is stalling. We'll tell you what we'd change first, and whether we're the right team to do it.",
  cta: { label: "Book an intro call", href: BOOKING_URL },
  slots: `${clientSlots.n} new client slots for ${clientSlots.quarter}`,
};

export const footer = {
  links: [
    { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { label: "LinkedIn", href: LINKEDIN_URL },
  ],
  copyright: "© 2026 Sari Sari LLC",
};
