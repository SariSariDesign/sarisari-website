import type { CaseStudy } from "./types";

/**
 * Disco (formerly GenWell) — ported from "Disco Case Study Draft 2.md"
 * (05 client work/13 GenWell/Claude outputs). Eris gave blanket approval for her quotes.
 * ⚠️ Before shipping: confirm build status (TestFlight vs App Store), "4 weeks" vs the
 * 21-day Diagnostic naming, and swap figure placeholders for the before/after exports.
 */
export const disco: CaseStudy = {
  slug: "disco",
  status: "published",
  client: "Disco",
  card: {
    productType: "Women's health app",
    helpedWith: ["Activation Diagnostic"],
    outcome: "Redesigned onboarding around one first-session win: saving the first pin.",
    image: null, // ⚠️ unbranded image pending
  },
  page: {
    title: "Turning strong signup intent into a first-session win",
    byline: "Client: Eris Hanson-Cooper, Founder & CEO, Disco",
    tags: ["Activation Diagnostic", "UX audit", "Product strategy", "Product design"],
    heroImage: null, // "/work/disco-hero.webp"
    heroStats: [
      { value: "44/100", label: "baseline Activation Score" },
      { value: "39", label: "screens audited" },
      { value: "4 wks", label: "from audit to handoff" },
    ],
    intro:
      "Disco is a women's health discovery app that pairs expert video, products and care with conversational voice AI. About four weeks after launch, founder Eris Hanson-Cooper asked us what would bring early signups back.",
    blocks: [
      {
        kind: "section",
        label: "Inquiry",
        title: "Registration was nearly frictionless. The next step was where users needed support.",
        paragraphs: [
          "Mixpanel data from Disco's early beta cohort showed over 94% of users completed registration. At the voice call, users split almost evenly: about 52% started it and 44% chose \"Skip for now.\"",
          "About 12% of all signups finished the call, and users who skipped reached the feed without personalized recommendations.",
        ],
      },
      {
        kind: "section",
        title: "Retention can't help users who haven't reached first value.",
        paragraphs: [
          "When founders see drop-off after launch, the instinct is to ask what will bring users back. A user who hasn't reached first value has nothing to come back to.",
          "We focused the sprint on session-one activation and saved broader retention loops for the 90-day roadmap.",
        ],
      },
      {
        kind: "quote",
        quote:
          "I thought it was crystal clear. The scorecard sets into motion: okay, we have things to work on, and now we're narrowing it down. There are lots of changes, but not everything is a priority.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "section",
        label: "Diagnosis",
        title: "Three things stood between new users and first value.",
        paragraphs: [
          "We combined Mixpanel analytics, a 39-screen audit against 11 weighted UX dimensions, two moderated user sessions, 24 beta feedback logs and five competitor teardowns. The flow scored 44 out of 100.",
          "• The voice call asked for 10–15 minutes before showing any matched content.\n• The call was audio-only, with no captions, pause or mute.\n• The conversation didn't leave a saved summary, so users had nothing to look back on.",
        ],
      },
      { kind: "figure", ratio: "774x516", caption: "Activation Scorecard: 44/100 baseline, with the call intro and in-call screens." },
      {
        kind: "section",
        label: "The pivot",
        title: "AI became the engine of health discovery, not the gate in front of it.",
        paragraphs: [
          "In week 2 we mapped the product into three surfaces: Disco Voice for the guided intake, Disco Chat for recaps and recommendations, and Boards and Pins for a personal library of answers, products and clinicians.",
          "With that clarity, Eris renamed the product from GenWell to Disco. We anchored the redesign on one activation moment: the first pin in session one.",
        ],
      },
      { kind: "step", title: "1. Let users hear Disco Voice first.", paragraphs: ["An audio preview on the value-proposition screen, before asking for the microphone, so users know what to expect."] },
      { kind: "step", title: "2. Personalize the \"Maybe later\" path.", paragraphs: ["\"Skip for now\" became \"Maybe later,\" with a 3-topic picker that seeds the feed right away. In-feed prompts bring users back to the call."] },
      { kind: "step", title: "3. Add captions, pause and plain-language privacy.", paragraphs: ["So the intake works on a train or at a desk, and users know how their health data is stored before they share it."] },
      { kind: "step", title: "4. End the call with a recap in Disco Chat.", paragraphs: ["A summary card linking what was said to matched videos, products and care providers."] },
      { kind: "step", title: "5. Make the first pin the win.", paragraphs: ["An explicit \"Pin\" button saves content into personal boards, and boards give users a reason to return."] },
      {
        kind: "figure-row",
        figures: [
          { ratio: "375x812", caption: "Disco Voice intro with audio preview" },
          { ratio: "375x812", caption: "Call with captions and pause" },
          { ratio: "375x812", caption: "Recap card in Disco Chat" },
        ],
      },
      {
        kind: "quote",
        quote: "I love the idea of the pin board. It's so actionable, so organized, and it also feels shareable.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "section",
        label: "Process",
        title: "Lo-fi first, so a big decision didn't cost finished design.",
        paragraphs: [
          "Week 1: data audit, screen review, user sessions and competitor teardowns. Week 2: Scorecard, flow teardown and lo-fi wireframes. Weeks 3–4: the new Disco identity, hi-fi prototype, Validation Guide and 90-day roadmap, handed over in one Figma file.",
          "Reviewing lo-fi before visual design is what gave Eris room to rename the product without throwing work away.",
        ],
      },
      {
        kind: "quote",
        quote:
          "The low fidelity was such an important step for us to go through together. I would have hated for you to design … without us having that touch point.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "split",
        title: "From handoff to a working build in two weeks.",
        paragraphs: [
          "Clear styles, component states and annotated flows let Eris bring the designs into code with Codex and stand up a TestFlight build within two weeks of handoff.",
          "Each design decision ships with a hypothesis and a test. When the new flow is live, we re-score it on the same rubric, aiming for 70 or higher, and track first pin in session one, time to activation and 7-day return.",
        ],
      },
      {
        kind: "stats",
        big: true,
        stats: [
          { value: "70+", label: "target Activation Score on re-test" },
          { value: "2 wks", label: "handoff to working build" },
        ],
      },
      {
        kind: "quote",
        quote:
          "They analyzed our entire product, tore it down to the nails, and then rebuilt a workflow that we're super excited to use.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
    ],
  },
};
