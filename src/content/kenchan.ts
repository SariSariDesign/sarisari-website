/**
 * Kenchan Ramen case study — copy verbatim from the Figma comp (page "IN PRODUCTION",
 * frame 8682:2552). Figure images/captions are placeholders pending assets.
 */

export const kenchan = {
  slug: "kenchan-ramen",
  title: "How a Single Feature Drove 37% of Digital Revenue",
  client: "Client: Kenchan Ramen · Partner: Kocah",
  tags: ["Strategy", "Brand design", "UX/UI Design", "Product Design"],
  heroStats: [
    { value: "37%", label: "of digital revenue" },
    { value: "+8.1%", label: "lift in AOV year over year" },
    { value: "< 1 hr", label: "until 1st conversion" },
  ],
  intro:
    "Kenchan Ramen brings restaurant-grade ramen kits to homes across the US. What started as a brand + CRO lift turned into product validation—and one of the brand's largest revenue drivers.",
  blocks: [
    {
      kind: "section" as const,
      label: "Inquiry",
      title: "The founder had seen a competitor's bundle builder and wanted to add it to their roadmap.",
      paragraphs: [
        "It was a fully custom bundle experience:",
        "• multi-step selection flow\n• dynamic pricing engine\n• real-time inventory validation\n• a slick UI that made the experience feel like curating a meal",
        "Kenchan wanted something comparable: a bundle-builder that let customers select their own kits and earn tiered discounts as they added more, a gamified path to higher AOV.",
      ],
    },
    {
      kind: "section" as const,
      title: "When execution gets cheaper, the decision about what to execute gets more consequential.",
      paragraphs: [
        "The full build entailed a custom theme block, discount logic, operational schema architecture, iterations, QA, and ongoing maintenance. This potentially carried a market-rate price tag of $12,000+, plus $1,000+ annually to maintain.",
        "They already used a similar bundling app, albeit without the ability to customize components. For a store on Shopify's Basic plan in need of foundational CROs, the investment didn't match the signal.",
      ],
    },
    {
      kind: "section" as const,
      title: "We reframed the project from “ship a feature” to “test if bundles even work.”",
      paragraphs: [
        "With 15+ individual SKUs and only 4 premade sets, most customers bought 1–3 kits at a time — which meant the real question wasn't how to build the feature, but whether bundle behavior was something their customers did at all.",
        "We challenged the brief and proposed changing their core objective to a testing POV: find out first, before building the complex version they'd seen elsewhere. With both teams aligned, the scope changed entirely: this wasn't a product build, but a validation.",
      ],
    },
    {
      kind: "figure" as const,
      ratio: "774x516",
      caption: "Fig 01 — caption TBD", // ⚠️ asset + caption needed
    },
    {
      kind: "stats" as const,
      stats: [
        { value: "37%", label: "Share of digital revenue after 1 month" },
        { value: "+8.1%", label: "Lift in average order value year over year" },
      ],
    },
    {
      kind: "section" as const,
      title: "When AI becomes your production partner, design becomes the strategic layer.",
      paragraphs: [
        "As AI takes more of the execution load, the constraint shifts from engineering capacity to product judgment. In this build, Shopify Magic handled assembly; design owned what to ship, how it should work, and how operators would run it day to day.",
      ],
    },
    {
      kind: "step" as const,
      title: "1. Architect the leanest version possible.",
      paragraphs: [
        "A full custom feature was cost-prohibitive without proof of customer behavior. Instead of building a new pricing engine, we relied on Shopify's native automatic discounts. This allowed us to focus on a single UI surface, using Shopify Magic's Theme Block generator to ship without custom engineering.",
      ],
    },
    {
      kind: "step" as const,
      title: "2. Define the operating model to enable non-technical operators after handoff.",
      paragraphs: [
        "Before writing a single prompt, we mapped the full operator schema: product selection, discount tiers, quantity thresholds, color palette, toast notifications. Fully editable through Shopify's Theme Editor with no developer access required.",
      ],
    },
    {
      kind: "figure-row" as const,
      figures: [
        { ratio: "182x122", caption: "Fig 02 — caption TBD" },
        { ratio: "379x253", caption: "Fig 03 — caption TBD" },
        { ratio: "379x253", caption: "Fig 04 — caption TBD" },
      ],
    },
    {
      kind: "step" as const,
      title: "3. Encode product strategy into the prompt.",
      paragraphs: [
        "We approached the prompt as a design brief: structured context, user flow, functional requirements, UX requirements, and brand constraints. Three iterations over a few hours resolved item removal logic, savings display prominence, and color token flexibility. The third iteration shipped.",
      ],
    },
    {
      kind: "step" as const,
      title: "4. Harden the experience through focused iteration.",
      paragraphs: [
        "We used 3 fast iterations to refine the UX and close gaps that AI missed, like how users edited the bundle, how savings and system feedback were communicated, and how components behaved across states.",
      ],
    },
    {
      kind: "quote" as const,
      quote:
        "Sari Sari didn't just execute a feature request—they reframed it into a validation question and shipped proof in a day. That bundle test went on to become one of the most reliable revenue levers in our digital channel.",
      name: "Jed G.",
      role: "Cofounder of Kocah",
    },
    {
      kind: "section" as const,
      title: "From spec to live bundle feature in under just a few hours—with zero custom engineering.",
      paragraphs: [
        "Sign-off took a single review, and the theme block shipped the same afternoon, with live data validating the decision within the first hour.",
        "The test ran for a few months. Over that time, the bundle experience didn't just prove the behavior as a short-lived experiment; it settled in as a core revenue engine.",
      ],
    },
    {
      kind: "figure" as const,
      ratio: "576x384",
      caption: "Fig 05 — caption TBD",
    },
    {
      kind: "split" as const,
      title: "From hypothesis test to a long-term revenue channel.",
      paragraphs: [
        "By separating the validation question from the infrastructure cost, we shipped a converting feature in an afternoon that a traditional build path would have taken six to eight weeks and $13K+ to produce.",
        "The Build A Bundle feature became Kenchan Ramen's single largest revenue driver, not through building the most sophisticated solution, but by building the right one.",
      ],
    },
    {
      kind: "stats" as const,
      big: true,
      stats: [
        { value: "37%", label: "Share of digital revenue after 1 month" },
        { value: "+8.1%", label: "Lift in average order value year over year" },
        { value: "+101%", label: "Total revenue growth year over year" },
        { value: "+ $1,351.29", label: "Average incremental daily revenue" },
        { value: "711", label: "Bundle redemptions" },
      ],
    },
    {
      kind: "figure" as const,
      ratio: "773x516",
      caption: "Fig 06 — caption TBD",
    },
  ],
};

export type KenchanBlock = (typeof kenchan)["blocks"][number];
