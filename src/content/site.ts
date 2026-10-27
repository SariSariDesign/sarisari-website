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
  minimumEngagement: "3-month", // confirmed 2026-10-26
  noticePeriod: "30 days", // confirmed 2026-10-26
  pauseHoldPeriod: "30 days", // confirmed 2026-10-26: slot held 30 days, then may be filled; no banked days or prorating
  startLeadTime: "two weeks", // confirmed 2026-10-26
};

export const nav = {
  links: [
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/#work" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
    { label: "FAQ", href: "/#faq" },
  ],
  cta: { label: "Book a call", href: BOOKING_URL },
};

/**
 * Hero headline A/B/C — comp shipped an author-facing switcher; A is the production
 * default. B/C are sanctioned alternates (recorded in copy-deck). The headline renders
 * in the editorial italic serif; option C is a centered two-line pairing.
 */
export const hero = {
  eyebrow: "For Seed to Series A founders",
  headline: "Design that turns users into regulars.",
  subhead:
    "Sari Sari is a senior-led design and development studio helping founders launch, fix and grow products people trust.",
  ctas: [
    { label: "Book a call", href: BOOKING_URL, variant: "primary" as const },
    { label: "Get free Scorecard", href: SCORECARD_URL, variant: "secondary" as const },
  ],
  marquee: {
    // The 13 clients. Grey silhouettes live in /public/logos; `mark: null` renders the
    // name as a wordmark. ⚠️ confirm logo permissions before launch.
    logos: [
      { name: "Selfbook", mark: "/logos/selfbook.png" },
      { name: "Silk & Sonder", mark: null },
      { name: "Lions & Lambs", mark: "/logos/lionslambs.png" },
      { name: "SWS Gifts", mark: null },
      { name: "Liberty Call", mark: null },
      { name: "Funding Solutions", mark: null },
      { name: "Lendzi", mark: "/logos/lendzi.png" },
      { name: "Signal Verified", mark: "/logos/signalverified.png" },
      { name: "NutriSnap", mark: null },
      { name: "Disco", mark: null },
      { name: "Nervana", mark: null },
      { name: "Kenchan", mark: null },
      { name: "Kocah", mark: null },
    ],
  },
};

export type Service = {
  n: string;
  title: string;
  body: string;
  /** Image shown when the row is open; null renders the hatch placeholder. */
  media?: string | null;
  /** Keyword tags shown when open (Supply caps). */
  tags?: string[];
  link?: { label: string; href: string };
};

export const services = {
  seeAll: { label: "See all services", href: "/services" },
  eyebrow: "",
  headline: "Design, research and code under one roof.",
  intro:
    "Senior designers and developers working on the numbers that matter most: conversion, activation, retention.",
  // Expandable rows: title collapsed; open shows `media` (client work or a placeholder),
  // a one-line body and keyword tags.
  cards: [
    {
      n: "01",
      title: "Digital products",
      media: "/work/nutrisnap.webp",
      body: "From idea to a launched product, aimed at the metric your next round depends on.",
      tags: ["Product strategy", "Product discovery", "MVP design", "Prototyping", "AI product UX", "Launch"],
    },
    {
      n: "02",
      title: "UX/UI design",
      media: "/work/funding-solutions.webp",
      body: "Flows and screens that make your product easy to start, and look like the company you've become.",
      tags: ["User flows", "Wireframes", "UI design", "Onboarding & activation", "Mobile & responsive", "Accessibility (WCAG)"],
    },
    {
      n: "03",
      title: "Design systems",
      body: "A component library your developers build from, so new features ship faster and stay consistent.",
      tags: ["Component libraries", "Design tokens", "Figma libraries", "Annotated dev handoff"],
    },
    {
      n: "04",
      title: "User testing & research",
      body: "We don't rely on just best practices or AI-generated personas. We watch real users try your product and show you where they stall and why.",
      tags: ["Usability testing", "User interviews", "Competitor analysis", "Funnel & analytics review", "Activation audits"],
    },
    {
      n: "05",
      title: "Full-stack development",
      media: "/work/kenchan-ramen.webp",
      body: "We build what we design, on your stack, so it goes live the way it was designed.",
      tags: ["Web apps", "Front-end & back-end", "Shopify", "AI features & integrations", "APIs & databases", "Dev guidance"],
    },
    {
      n: "06",
      title: "Branding & marketing support",
      body: "A brand, site and pitch deck that make an early company look as credible as its product.",
      tags: ["Brand identity", "Websites", "Landing pages", "Pitch decks & investor collateral", "Launch assets"],
    },
  ] satisfies Service[],
};

/**
 * Use cases: four problems, each pointing at one offer. The image is a hero print that
 * drops into the card on scroll (`print` = index in `work.regulars`). `offer` is the id of
 * the pricing card the button scrolls to and highlights.
 * ⚠️ Card images should become variants so they don't repeat the case study images.
 */
export const useCases = {
  headline: "How can we help?",
  cards: [
    {
      print: 2, // Disco
      problem: "Users sign up, then disappear",
      outcome: "Find where they leave and fix that first.",
      offer: { id: "offer-audit", label: "Activation Audit" },
    },
    {
      print: 4, // NutriSnap
      problem: "It looks like every other AI-built app",
      outcome: "Give it a look and flow that's yours.",
      offer: { id: "offer-diagnostic", label: "Activation Diagnostic" },
    },
    {
      print: 1, // Funding Solutions
      problem: "You're launching something new",
      outcome: "Brand, product and site, designed and built together.",
      offer: { id: "offer-build", label: "Activation Build" },
    },
    {
      print: 0, // Kenchan
      problem: "Your roadmap is stuck waiting on a design hire",
      outcome: "A senior team that starts in two weeks.",
      offer: { id: "offer-scale", label: "Scale" },
    },
  ],
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
    { client: "Lendzi", image: null, aspect: "3/2", caseStudy: "lendzi" },
    { client: "NutriSnap", image: "/work/nutrisnap.webp", aspect: "6/7", caseStudy: "nutrisnap" },
    { client: "Portfolio piece", image: null, aspect: "1/1" }, // ⚠️ sixth piece TBD
  ] satisfies PortfolioPiece[],
};

/** Homepage Case Studies section copy; the studies themselves live in `content/case-studies`. */
export const caseStudiesSection = {
  seeAll: { label: "See all work", href: "/work" },
  eyebrow: "",
  headline: "Freshly stocked",
  // Editorial layout: Kenchan square, Funding Solutions portrait (dropped lower),
  // NutriSnap wide below. Tiles link only once the case study is published.
  // ⚠️ Brand colors sampled from the project images; confirm the real ones.
  tiles: [
    {
      slug: "kenchan-ramen",
      title: "Building a bundle feature that drove 37% of digital revenue",
      tags: ["E-commerce", "Conversion", "Shopify"],
      color: "#1e2d74",
      layout: "square" as const,
    },
    {
      slug: "funding-solutions",
      title: "Turning high-stakes loan ops into a self-serve lending pipeline",
      tags: ["Fintech", "0→1 design", "B2B tools"],
      color: "#2a1a52",
      layout: "portrait" as const,
    },
    {
      slug: "nutrisnap",
      title: "Turning nutrition science into a first session people trust",
      tags: ["Health", "Activation", "AI-built app"],
      color: "#24543c",
      layout: "wide" as const,
    },
  ],
};

/** Process section (homepage): the belief statement and three pinned principles. */
export const pointOfView = {
  line1: "AI makes building easy.",
  // `underline` is the word that gets the hand-drawn underline.
  line2: { before: "We make it ", underline: "clear", after: ": what's wrong, what to fix first, and why." },
  principles: [
    {
      title: "Machine speed, human curation.",
      body: "Generative tools handle the heavy lifting of production. We provide the vision, direction, and editorial discipline to ensure the final product actually matters.",
    },
    {
      title: "Trust at every touchpoint.",
      body: "Just as sari sari stores run on familiarity and trust, we design the critical micro-moments that turn first-time users into regulars, from fintech to health to e-commerce.",
    },
    {
      title: "Evidence over instincts.",
      body: "We put interactive flows in front of actual users, watch where they hesitate, and fix that first. We test our instincts against real behavior, then build what holds up.",
    },
  ],
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
  headline: "Who you'll work with",
  members: [
    {
      name: "Zach Chaco",
      role: "CEO & Co-Founder",
      bio: "Previously Meta, Disney.",
      photo: "/team/zach-chaco.jpg",
    },
    {
      name: "Patricia Capiral",
      role: "Head of Design & Co-Founder",
      bio: "Previously Selfbook, Silk & Sonder, Guess.",
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
  headline: "Ask our regulars.",
  // Approved quotes only, in this order. Steve (NutriSnap) and Steve C. (Lions & Lambs)
  // are pending approval: add them here once approved. Do not fabricate.
  items: [
    {
      quote:
        "The speed of delivery and the quality of delivery is so excellent. You guys unblocked a huge work stream so quickly and efficiently.",
      name: "Eris Hanson-Cooper",
      role: "Founder & CEO",
      company: "Disco",
      photo: null,
    },
    {
      quote:
        "The five findings are spot on, and the usability session data makes them hard to argue with... The things I knew felt off but couldn't articulate this clearly. Your diagnostic gave me a clear punch list to work from. Highly recommend giving your process a shot; you have nothing to lose.",
      name: "Michael Campbell",
      role: "CEO",
      company: "Signal Verified",
      photo: "/testimonials/michael-campbell.webp",
    },
    {
      quote:
        "Sari Sari provided a much-needed, research-informed refresh for my live mobile app. They not only helped tear down every single screen, but also suggested helpful recommendations which were simple to test. I am so grateful they spent the time to dive into every detail and ask clarifying questions along the way - I felt they really understood my business and objectives.",
      name: "Nora Rabah Rodden",
      role: "Founder",
      company: "Nervana",
      photo: null,
    },
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
        "The appearance of my company now is just so much more professional thanks to the amazing talents of the Sari Sari designers…",
      name: "Jherray Babida",
      role: "President",
      company: "Social Wine & Spirit",
      photo: null,
    },
  ] satisfies Testimonial[],
};

/**
 * Homepage pricing (Batch 6). The services pages still read `pricing` below. Ids let the
 * use-case buttons scroll to and highlight a card.
 */
export const homePricing = {
  headline: "Ready to get started?",
  scale: {
    id: "offer-scale",
    kicker: "Ongoing · 3-month minimum",
    name: "Scale",
    price: "$16K/mo",
    description: "Ongoing design and development on an open roadmap. You set the direction.",
    bullets: [
      "One senior team for design and code",
      "We join your standups, reviews and user tests",
      "Starts within two weeks",
      "3-month minimum, then 30 days notice",
    ],
    bestFor: "Best for: high-velocity teams that need flexible, ongoing design and engineering.",
    grow: { label: "Design only? Grow, $8K/mo", href: "/services/retainers" },
    cta: { label: "Book a call", href: BOOKING_URL },
  },
  offers: [
    {
      id: "offer-audit",
      kicker: "7 days",
      name: "Activation Audit",
      price: "$1,500",
      description:
        "Discover where users leave in any single flow. Get a scorecard and teardown of that flow with prioritized recommendations.",
      bestFor: "Best for: something's off but you need clarity.",
      cta: { label: "Book a call", href: BOOKING_URL },
    },
    {
      id: "offer-diagnostic",
      kicker: "21 days",
      name: "Activation Diagnostic",
      price: "$6,000",
      description:
        "Find the biggest problem in any single flow and see the fix. Get a redesigned prototype, a validation guide and a 90-day roadmap.",
      bestFor: "Best for: you want the fix designed and tested before investing in development.",
      cta: { label: "Book a call", href: BOOKING_URL },
    },
    {
      id: "offer-build",
      kicker: "90 days",
      name: "Activation Build",
      price: "Let's talk",
      description:
        "Ship one defined project in 90 days. We design and build it, or guide your developers through it.",
      bestFor: "Best for: one defined project, like a launch or redesign.",
      note: "Diagnostic fee credited if you start within 30 days",
      cta: { label: "Book a call", href: BOOKING_URL },
    },
  ],
  offersHeading: "Not ready for a retainer? Start smaller.",
  scorecard: {
    badge: "Free",
    kicker: "In minutes",
    name: "Activation Scorecard",
    description:
      "Drop in your URL to get your activation score and the top 5 points of friction keeping visitors from signing up. Free, in minutes.",
    cta: { label: "Get free Scorecard", href: SCORECARD_URL },
  },
};

export const pricing = {
  eyebrow: "",
  headline: "No guesswork. One price.", // ⚠️ revisit: two retainer tiers now
  compare: { label: "Compare retainers", href: "/services/retainers" },
  retainer: {
    id: "offer-scale",
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
      id: "offer-audit",
      name: "Audit",
      price: "$1,500",
      body: "You give us the flow; we find where customers are leaking. You get a scorecard and a teardown of that flow with prioritized recommendations. Best if you've been guessing why users leave and want clarity.",
      cta: { label: "Try it for free", href: SCORECARD_URL },
    },
    {
      id: "offer-diagnostic",
      name: "Diagnostic",
      price: "$6,000",
      body: "We find the highest-impact fix, whether that's activation, conversion, or retention, and deliver a redesigned prototype you can implement. Best if you know where the leak is and want the fix.",
      cta: { label: "See the diagnostic", href: DIAGNOSTIC_URL },
    },
    {
      id: "offer-build",
      name: "Build",
      price: "Let's talk",
      body: "Looking for something more? Got something big in the works?",
      cta: { label: "Book a call", href: BOOKING_URL },
    },
  ],
};

export const faq = {
  eyebrow: "",
  headline: "Questions?",
  intro: { before: "Can't find your answer? Book a call or email us at ", email: "hello@sarisari.design", after: " to learn more." },
  cta: { label: "Book a call", href: BOOKING_URL },
  items: [
    {
      q: "How soon can you start?",
      a: `Usually within ${terms.startLeadTime} of a signed agreement. The Audit and Diagnostic can start sooner. We keep a limited number of clients, so we'll confirm your date on the call.`,
    },
    {
      q: "How do you work with our developers?",
      a: "Two ways. We design and hand your developers annotated files they can build from, and stay on hand while they build. Or our developers build it with you, on your stack.",
    },
    {
      q: "What's the difference between Build and Grow/Scale?",
      a: "Build is one defined project on a set 90-day timeline. Grow and Scale are ongoing, with an open roadmap you steer month to month. Grow is design; Scale is design and engineering.",
    },
    {
      q: "Does the Diagnostic fee count toward Build?",
      a: "Yes. Sign Build within 30 days of your Diagnostic delivery and the fee is credited toward it.",
    },
    {
      q: "Why you instead of AI tools, a freelancer or a hire?",
      a: `We use AI tools every day to move faster, and we're accountable for what to build and what to cut. A freelancer gives you one person's hours; a senior hire takes months to find. We're a senior design and development team that can start in ${terms.startLeadTime}.`,
    },
    {
      q: "What do we need ready before starting?",
      a: "A decision-maker who can join a weekly review, access to your analytics and users, and one owner on your side for approvals. We handle the rest of setup in week one.",
    },
    {
      q: "Who owns the files and IP?",
      a: "You do, once each invoice is paid. Design files, code and research live in accounts you control, and they stay yours if we stop working together.",
    },
    {
      q: "What if it isn't working?",
      a: `You give ${terms.noticePeriod} notice and stop paying, with no wind-down fees or penalties. We'd rather part cleanly than hold a client who isn't getting value.`,
    },
    {
      q: "Can we pause the retainer?",
      a: `Pause anytime. We hold your slot for ${terms.pauseHoldPeriod}. After that we may fill it, and you'd restart when one opens.`,
    },
    {
      q: "What happens when we hire our own designer?",
      a: "We hand over everything: files, design system and context, so your new designer starts where we left off.",
    },
    {
      q: "Do you only work with health and wellness companies?",
      a: "No. A lot of our work is in health, fintech and e-commerce, where users have to trust a product before they come back. We work with founders in any industry.",
    },
  ],
};

export const footerCta = {
  headline: "Tell us what you're building, or where it's stuck.",
  subhead:
    "Thirty minutes. We'll tell you what we'd change first, and whether we're the right team to do it.",
  cta: { label: "Book a call", href: BOOKING_URL },
  secondary: { label: "Get free Scorecard", href: SCORECARD_URL },
};

export const footer = {
  links: [
    { label: "Contact", href: "/contact" },
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

/** /services overview: services list, two offer cards, a pricing summary, and an FAQ subset. */
export const servicesPage = {
  eyebrow: "Services",
  title: services.headline,
  intro: services.intro,
  listHeading: "What we do",
  offersHeading: "Two ways to work with us",
  offers: [
    {
      name: "Retainers",
      price: "From ⚠️ $X,000/mo", // ⚠️ set once Grow is priced
      body: "An embedded senior product team. Grow while you find fit; Scale when you're ready to move fast.",
      cta: { label: "Compare retainers", href: "/services/retainers" },
    },
    {
      name: "Activation Diagnostic",
      price: "From $1,500",
      body: "Find where customers leak, then get the redesigned fix. Start with a free scorecard.",
      cta: { label: "Learn about the diagnostic", href: "/services/activation-diagnostic" },
    },
  ],
  faqHeading: "Questions about working with us",
  faqQuestions: [
    "How soon can you start?",
    "What if it isn't working?",
    "Can we pause the retainer?",
    "What do we need ready before starting?",
  ],
  faqItems() {
    return faq.items
      .filter((f) => this.faqQuestions.includes(f.q))
      .map((f) => ({ label: f.q, body: f.a }));
  },
};

/** /services/retainers: Grow vs Scale. Scale is the existing retainer. */
export const retainers = {
  eyebrow: "Retainers",
  title: "Grow vs. Scale",
  intro: "Same senior team, same rituals. The difference is how much we take on each month.", // ⚠️ drafted
  tiers: [
    {
      name: "Grow",
      price: "⚠️ $X,000", // ⚠️ price pending
      period: "/ month",
      description: "⚠️ For teams finding fit: one focus area at a time, design-led.", // ⚠️ drafted
      cta: { label: "Book an intro call", href: BOOKING_URL },
      features: [
        { title: "⚠️ Feature one" },
        { title: "⚠️ Feature two" },
        { title: "⚠️ Feature three" },
      ] as { title: string; body?: string }[],
    },
    { name: "Scale", ...pricing.retainer },
  ],
};

/** /services/activation-diagnostic: overview that sends people to the diagnostic app. */
export const diagnostic = {
  eyebrow: "Activation Diagnostic",
  title: "Find the leak. Get the fix.",
  intro:
    "Most products lose people between sign-up and the first moment of value. We find exactly where, and redesign it.", // ⚠️ drafted
  tiers: pricing.offers.filter((o) => o.name !== "Build"),
  cta: { label: "Open the diagnostic", href: DIAGNOSTIC_URL },
};

/** /contact: Calendly is the primary path; the Say Hello form is the secondary. */
export const contact = {
  eyebrow: "Contact",
  title: "Let's talk about where growth is stalling.",
  intro: "Pick a time below, or send a note if you'd rather start by email.", // ⚠️ drafted
  bookingHeading: "Book a call",
  bookingEmbed: `${BOOKING_URL}?hide_gdpr_banner=1`,
  form: {
    heading: "Say hello",
    fields: { name: "Name", email: "Email", company: "Company (optional)", message: "Message" },
    submit: "Send",
    sending: "Sending…",
    success: "Thanks — we'll reply within one business day.", // ⚠️ confirm SLA
    fallbackError: `Something went wrong. Email us at ${CONTACT_EMAIL}.`,
  },
};
