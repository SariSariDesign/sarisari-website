/**
 * Site copy — mirrors content/copy-deck.md (the reviewable source).
 * ✅ verbatim from the Figma comp · ⚠️ drafted, pending Zach/Patti review.
 */

export const BOOKING_URL = "https://calendly.com/sarisari/30min";
export const CONTACT_EMAIL = "hello@sarisari.design"; // TBD — confirm address

export const nav = {
  links: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/#about" },
  ],
  cta: { label: "Book an Intro", href: BOOKING_URL },
};

export const hero = {
  eyebrow: "Seed → Series A",
  // [pre, italic, post] — italic span renders in PP Editorial Old Italic
  headline: { pre: "Design to help SaaS apps work ", em: "just right", post: "." },
  subhead: "A digital product design studio that gets you.",
  cta: { label: "Book an Intro", href: BOOKING_URL },
};

export const differentiator = {
  index: "01",
  headline: "We close the gap between a great product and a shipped one.", // ⚠️ draft
  body: [
    "At Sari Sari Design, we build products that look & WORK as well as you think, closing the gap between a great product + a shipped one.",
    "Strategy, design, development, & AI-powered workflows work together to deliver results that matter.",
  ],
};

export const work = {
  index: "02",
  headline: "Work that moves the numbers that matter.", // ⚠️ draft
  projects: [
    {
      title: "Kenchan Ramen",
      year: "2025",
      type: "Product validation / CRO",
      industry: "e-commerce, food",
      href: "/work/kenchan-ramen",
    },
    {
      title: "Funding Solutions",
      year: "2026",
      type: "Website design",
      industry: "finance, fintech",
      href: "https://sarisari.short.gy/website-CS-FS", // external deck until page exists
    },
    {
      title: "Lendzi",
      year: "2025",
      type: "Design system, product design",
      industry: "finance, fintech",
      href: null,
    },
  ],
  ctaCard: { title: "Your Project", year: "2026", href: BOOKING_URL },
};

export const services = {
  index: "03",
  headline: "Design, develop, deliver, repeat.",
  aside: "A digital product design studio that gets you.",
  cta: { label: "Book an Intro", href: BOOKING_URL },
  items: [
    {
      label: "Design Consultation",
      body: "Not sure where design fits in your roadmap? We audit what you have, identify the highest-leverage fixes, and give you a prioritized plan — whether or not you build with us.", // ⚠️ draft
    },
    {
      label: "Product Design",
      body: "Translate your post-funding product backlog into structured, shippable, done-for-you flows. We scope, design, and spec features end-to-end so your engineering teams can build with confidence.",
    },
    {
      label: "UX Design",
      body: "Research, flows, and interaction design that remove friction where it costs you money — onboarding, verification, checkout, and the unglamorous edge cases in between.", // ⚠️ draft
    },
    {
      label: "UI Design",
      body: "Interfaces that signal the trust your product has earned. Design systems, component libraries, and UI that looks as legitimate as your business is.", // ⚠️ draft
    },
    {
      label: "Development",
      body: "We deliver annotated Figma files, design tokens, and documentation so nothing gets lost between design and code.",
    },
  ],
};

export const approach = {
  index: "04",
  headline: "We focus on conversion UX to meet goals quickly.",
  body: [
    "Pretty isn't the goal — converting is. We design against the metrics you already track: activation, AOV, retention, time-to-value.", // ⚠️ draft (comp had duplicate of differentiator body)
  ],
};

export const testimonials = {
  index: "05",
  headline: "Word around the block",
  reviews: [
    {
      date: "2025 May",
      quote:
        "Sari Sari didn't just execute a feature request—they reframed it into a validation question and shipped proof in a day. That bundle test went on to become one of the most reliable revenue levers in our digital channel.",
      name: "Jed G.",
      role: "Cofounder of Kocah",
    },
    // ⚠️ 2 more candidates pending permission — see copy-deck §6
  ],
};

export const team = {
  index: "06",
  headline: "People you'll actually work with.",
  members: [
    {
      name: "zach",
      bio: "Zach leads strategy and development. 20+ years across startups and Fortune 500s (Meta, Disney), focused on making design decisions that survive contact with engineering.", // ⚠️ draft
    },
    {
      name: "patricia",
      bio: "Patti leads design. She turns messy product backlogs into shipped, compliant, conversion-focused UX — and the design systems that keep them consistent.", // ⚠️ draft
    },
  ],
};

export const pricing = {
  index: "07",
  headline: "Let's make things that people will keep coming back for.",
  label: "Pricing",
  price: "$12,000 / month",
  body: "Easy, predictable pricing you can depend on. Perfect for seed to Series A teams who need to be as legitimate, trustworthy, and compliant as your investors + users need you to be.",
  cta: { label: "Let's Do It", href: BOOKING_URL },
  included: [
    {
      label: "Senior design leadership",
      body: "Principal-level product thinking on every engagement — not juniors behind a senior's title slide.", // ⚠️ draft
    },
    {
      label: "Complete UX audit",
      body: "A thorough review of your existing product experience with a prioritized roadmap of what to fix, what to redesign, and what to leave alone.",
    },
    {
      label: "Strategic product roadmap",
      body: "We map your priorities with you and reprioritize every sprint. No long-term contracts or cancellation penalties.", // ⚠️ draft
    },
    {
      label: "Compliant product design",
      body: "Onboarding, verification, payments, and permissions designed with SOC2, PCI DSS, and KYC requirements built in from day one.",
    },
    {
      label: "Dev-Ready Handoff",
      body: "Annotated specs, edge cases, error states, and responsive behavior documentation with every design.", // ⚠️ draft
    },
    {
      label: "Fast, Scalable Shipping Cadence",
      body: "Productive within the first week. Focused sprints on your highest-priority features, shipped continuously.", // ⚠️ draft
    },
  ],
};

export const faq = {
  index: "08",
  headline: "Questions?",
  cta: { label: "Ask Us Anything", href: `mailto:${CONTACT_EMAIL}` },
  items: [
    {
      q: "Why Sari Sari over others?",
      a: "We've worked in startups and Fortune 500 companies, including Meta and Disney, with combined experience of 20+ years working in tech and design.",
    },
    {
      q: "How is this easier than hiring a full-time designer?",
      a: "A senior product designer costs $180k–$220k/yr before benefits and equity, takes months to hire, and still needs to be managed.",
    },
    {
      q: "How is this different from an agency?",
      a: "Agencies scope projects, deliver mockups, and move on. We embed into your team and work continuously on your roadmap.",
    },
    {
      q: "How quickly can you get up to speed on our product?",
      a: "Most engagements are productive within the first week.",
    },
    {
      q: "How do you handle compliance and regulatory requirements?",
      a: "We design with SOC2, PCI DSS, and KYC frameworks in mind from the start.",
    },
    {
      q: "How do you work with our engineering team?",
      a: "Every design we deliver includes annotated specs, edge cases, error states, and responsive behavior documentation.",
    },
    {
      q: "What does the first month look like?",
      a: "Week one is kickoff and audit — we review your existing product, map your priorities, and align on scope.",
    },
    {
      q: "What if our needs change mid-engagement?",
      a: "We work in sprints and reprioritize with you regularly. No long-term contracts or cancellation penalties.",
    },
  ],
};

export const footer = {
  headline: "Make things that people keep coming back for.",
  cta: { label: "Book Intro Call", href: BOOKING_URL },
  columns: [
    [
      { label: "Email", href: `mailto:${CONTACT_EMAIL}` },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/sarisaridesign" }, // ⚠️ confirm URL
      { label: "Instagram", href: "https://www.instagram.com/sarisari.design" }, // ⚠️ confirm URL
    ],
    [
      { label: "© Sari Sari llc", href: null },
      { label: "Privacy", href: "/privacy" },
      { label: "T&Cs", href: "/terms" },
    ],
  ],
};
