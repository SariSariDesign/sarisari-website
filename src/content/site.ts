/**
 * Site copy — the reviewable source of truth for the homepage, ported verbatim from
 * the Claude-Design comp (decoded to `.context/decoded-template.html`).
 * ⚠️ = drafted / placeholder, pending Zach/Patti sign-off · everything else is comp-verbatim.
 * Full narrative + follow-ups tracked in content/copy-deck.md.
 */

export const BOOKING_URL = "https://calendly.com/sarisari/30min";
export const DIAGNOSTIC_URL = "https://activation-diagnostic.sarisari.design/";
/** Free activation scorecard (lead magnet). Lives in the activation-diagnostic app. */
export const SCORECARD_URL = "https://activation-diagnostic.sarisari.design/preview";
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

export const nav = {
  links: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/#about" },
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
    A: {
      headline: "Let's build products your people need.",
      note: "A — the fractional play",
      centered: false,
    },
    B: { headline: "We build products people use.", note: "B — quiet confidence", centered: false },
    C: {
      headline: "Products your people need. Experiences they come back to.",
      note: "C — on-brand pairing",
      centered: true,
    },
    D: {
      headline: "Design that turns sign\u2011ups into regulars", // non-breaking hyphen
      note: "D — the regulars play",
      centered: false,
    },
  },
  activeHeadline: "D" as "A" | "B" | "C" | "D",
  subhead: "A product design studio that helps you acquire, convert, and retain more customers.",
  ctas: [{ label: "Let's chat", href: BOOKING_URL, variant: "primary" as const }],
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

export type Service = {
  n: string;
  title: string;
  body: string;
  /** Image shown when the row is open; null renders the hatch placeholder. */
  media?: string | null;
  /** Capability bullets shown when open. */
  points?: string[];
  link?: { label: string; href: string };
};

export const services = {
  seeAll: { label: "See all services", href: "/services" },
  eyebrow: "Our Services",
  headline: "Your product got you here. We build what's next.",
  intro:
    "Whether you've just launched or you're preparing for the next raise, our team of senior-level product designers is aimed at the numbers that matter most: conversion, retention, activation, and satisfaction.",
  // Expandable rows: title collapsed; open shows `media` (client work or a placeholder),
  // the body, and optional `points`. Six rows per the 2026-10-21 feedback. ⚠️ Combined
  // bodies (UX/UI, Branding & marketing) and Digital products are drafted, pending sign-off.
  cards: [
    {
      n: "01",
      title: "Digital products",
      media: "/work/nutrisnap.webp",
      body: "From idea to launch: strategy, design, and build under one roof, aimed at the metric your next round depends on.",
    },
    {
      n: "02",
      title: "UX/UI design",
      media: "/work/funding-solutions.webp",
      body: "Flows and wireframes for every state, and screens that make a two-year-old product look like the company you've become.",
    },
    {
      n: "03",
      title: "Design systems",
      body: "A component library and tokens your team assembles from, so new features stop being redesigns.",
    },
    {
      n: "04",
      title: "User testing & research",
      body: "We put your flows in front of real users and come back with the reason they stall, not a deck of opinions.",
    },
    {
      n: "05",
      title: "Full-stack development",
      media: "/work/kenchan-ramen.webp",
      body: "We build it ourselves. What we design is what goes live, on your stack.", // ⚠️ confirm full-stack wording
    },
    {
      n: "06",
      title: "Branding & marketing support",
      body: "Type, color, and voice that grow with the product, plus landing pages and launch assets that match it.",
    },
  ] satisfies Service[],
};

/** A portfolio piece in the hero clutter and the Our Regulars gallery wall. */
export type PortfolioPiece = {
  client: string;
  /** Client-work image; null renders the hatch placeholder. */
  image: string | null;
  /** Print aspect ratio (CSS `aspect-ratio`), kept identical while hanging and landed. */
  aspect: string;
  /** Slug of the matching case study, if any (links once that case study is published). */
  caseStudy?: string;
};

export const work = {
  eyebrow: "",
  headline: "Our Recent Clients",
  // Six pieces hang in the hero like stock in a sari-sari store window and fall onto this
  // gallery wall on scroll: the visual hook before Services. ⚠️ Disco (unbranded),
  // Lendzi and the sixth piece still need images.
  regulars: [
    {
      client: "Kenchan Ramen",
      image: "/work/kenchan-ramen.webp",
      aspect: "4/3",
      caseStudy: "kenchan-ramen",
    },
    {
      client: "Funding Solutions",
      image: "/work/funding-solutions.webp",
      aspect: "4/3",
      caseStudy: "funding-solutions",
    },
    { client: "Disco", image: null, aspect: "4/3", caseStudy: "disco" },
    { client: "Lendzi", image: null, aspect: "3/2" },
    { client: "NutriSnap", image: "/work/nutrisnap.webp", aspect: "6/7" },
    { client: "Portfolio piece", image: null, aspect: "1/1" }, // ⚠️ sixth piece TBD
  ] satisfies PortfolioPiece[],
};

/** Homepage Case Studies section copy; the studies themselves live in `content/case-studies`. */
export const caseStudiesSection = {
  seeAll: { label: "See all work", href: "/work" },
  eyebrow: "",
  headline: "Our Recent Projects",
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
  eyebrow: "",
  headline: "Your team",
  members: [
    {
      name: "Zach Chaco",
      role: "Chief Executive Officer",
      bio: "Producer, previously Meta and Disney.",
      photo: "/team/zach-chaco.jpg",
    },
    {
      name: "Patricia Capiral",
      role: "Chief Creative Officer",
      bio: "15+ years of product and brand design.",
      photo: "/team/patricia-capiral.jpg",
    },
  ],
};

export type Testimonial = {
  /** null = quote pending sign-off; renders a placeholder card. */
  quote: string | null;
  name: string;
  role: string | null;
  company: string;
  photo: string | null;
};

export const testimonials = {
  eyebrow: "",
  headline: "Ask our regulars.", // ⚠️ new intro copy, pending sign-off
  // Jed G. is verbatim from the Kenchan case study; Michael Campbell is verbatim from the
  // live activation-diagnostic site. ⚠️ The rest are pending (testimonial bank in Notion;
  // Steve's is being drafted from his 1 Million Cups endorsement). Do not fabricate.
  items: [
    {
      quote:
        "Sari Sari didn't just execute a feature request—they reframed it into a validation question and shipped proof in a day. That bundle test went on to become one of the most reliable revenue levers in our digital channel.",
      name: "Jed G.",
      role: "Cofounder",
      company: "Kocah",
      photo: null,
    },
    {
      quote:
        "The five findings are spot on, and the usability session data makes them hard to argue with. The competing CTAs, the undefined proprietary terms, and the buried proof are all things I knew felt off but couldn't articulate this clearly. Highly recommend giving your process a shot; you have nothing to lose.",
      name: "Michael Campbell",
      role: "CEO",
      company: "Signal Verified",
      photo: "/testimonials/michael-campbell.webp",
    },
    { quote: null, name: "Steve", role: null, company: "", photo: null },
    { quote: null, name: "Lendzi", role: null, company: "", photo: null },
    { quote: null, name: "Dre", role: null, company: "", photo: null },
    { quote: null, name: "Nora", role: null, company: "", photo: null },
    { quote: null, name: "NutriSnap", role: null, company: "", photo: null },
    { quote: null, name: "Nirvana", role: null, company: "", photo: null },
    { quote: null, name: "Disco", role: null, company: "", photo: null },
  ] satisfies Testimonial[],
};

export const pricing = {
  eyebrow: "",
  headline: "No guesswork. One price.",
  retainer: {
    price: "$16,000",
    period: "/ month",
    description:
      "Product design expertise focused on getting you more customers that stay longer. Priced so you can move quickly. No long-term contracts.",
    cta: { label: "Book an intro call", href: BOOKING_URL },
    // `body` is optional: some features are a single line.
    features: [
      {
        title: "One team for design, development, and strategy.",
        body: "Senior product experts that design and ship at the speed your startup actually moves.",
      },
      { title: "Design systems built to scale." },
      { title: "We shape the roadmap together; you decide on the direction." },
      {
        title: "We embed into your product team's rituals.",
        body: "Anything from standups and design workshops to test parties.",
      },
      {
        title: "We focus on where you're leaking customers.",
        body: "Not just prototypes and wireframes: product design that gets outcomes.",
      },
    ] as { title: string; body?: string }[],
  },
  offersHeading: "Not ready for a retainer? Start smaller.",
  // Lighter cards under the retainer hero. Prices per the 2026-10-20 sync.
  offers: [
    {
      name: "Audit",
      price: "$1,500",
      body: "You give us the flow; we find where customers are leaking. You get a scorecard and a teardown of that flow with prioritized recommendations. Best if you've been guessing why users leave and want clarity.",
      cta: { label: "Try it for free", href: SCORECARD_URL },
    },
    {
      name: "Diagnostic",
      price: "$6,000",
      body: "We find the highest-impact fix, whether that's activation, conversion, or retention, and deliver a redesigned prototype you can implement. Best if you know where the leak is and want the fix.",
      cta: { label: "See the diagnostic", href: DIAGNOSTIC_URL },
    },
    {
      name: "Build",
      price: "Let's talk",
      body: "Looking for something more? Got something big in the works?",
      cta: { label: "Book a call", href: BOOKING_URL },
    },
  ],
};

export const faq = {
  eyebrow: "",
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
};

export const footer = {
  links: [
    { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  copyright: "© 2026 Sari Sari LLC",
};

/** /work index copy. */
export const workIndex = {
  eyebrow: "Work",
  title: "Product design that moved a number.", // ⚠️ drafted
  intro: "Every study names the metric we were hired to move and what happened to it.", // ⚠️ drafted
};
