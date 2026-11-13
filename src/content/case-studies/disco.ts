import { SCORECARD_URL } from "../site";
import type { CaseStudy } from "./types";

/**
 * Disco (formerly GenWell) — condensed (~30%+) from the version sent to Eris for review:
 * "05_Disco - Activation Diagnostic Case Study draft for review.pdf" (Nov 2026). Wording kept
 * from that draft; S6 (Process) folded into The pivot, S8 into Key takeaways. Eris gave blanket approval for her quotes.
 * Posted after Eris's approval window passed without a response (Oct 2026).
 * Note: confirm build status (TestFlight vs App Store), "4 weeks" vs the
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
    image: "/work/disco-square.webp",
  },
  page: {
    title: "Why 94% signup completion didn't matter",
    byline: "Client: Eris Hanson-Cooper, Founder & CEO, Disco",
    tags: ["Activation Diagnostic", "UX audit", "Product strategy", "Product design"],
    heroImage: "/work/disco-cover.webp",
    heroStats: [
      { value: "44/100", label: "baseline Activation Score" },
      { value: "39", label: "screens annotated" },
      { value: "4 weeks", label: "audit to handoff" },
    ],
    intro:
      "A women's health app with strong signup intent and an onboarding drop. Four weeks to diagnose the friction and redesign around a single moment of value.",
    cta: {
      headline: "Find the activation problems worth fixing first.",
      subhead:
        "The Diagnostic pinpoints where users lose momentum and gives you a clear plan to drive session-one value. Know what to fix next and where to focus your team's limited runway.",
      primary: { label: "Explore The Diagnostic", href: "https://activation-diagnostic.sarisari.design/" },
      secondary: { label: "Get Free Scorecard", href: SCORECARD_URL },
    },
    blocks: [
      {
        kind: "section",
        label: "Summary",
        title: "How clarifying session-one activation set Disco up for long-term product momentum",
        paragraphs: [
          "Disco is a women's health discovery app that pairs expert video content, products, and care with conversational voice AI. About four weeks after launch, founder and CEO Eris Hanson-Cooper reached out to understand what would bring early signups back into the app.",
          "Over four weeks, Sari Sari audited 39 screens, scored the flow at 44/100, and redesigned the critical path around a single activation moment: the user's first pin in session one. Within two weeks of handoff, Eris used the deliverables to build a working prototype in Codex.",
        ],
      },
      {
        kind: "figure",
        span: "full",
        ratio: "2400x1600",
        caption: "The redesigned critical path: the main path to the first pin, with the \u201cMaybe later\u201d path looping back to Disco Voice.",
        image: "/work/disco-user-flow.webp",
      },
      {
        kind: "quote",
        quote:
          "The speed and quality of delivery is so excellent. You unblocked a huge work stream quickly and efficiently. I'm more than wildly impressed with the outcome.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "callout",
        title: "Key takeaways for founders",
        items: [
          { lead: "Audit before adding.", text: "Measure exactly where new users stop, and why. Fixing session-one activation yields far higher leverage than building new features for a leaky bucket." },
          { lead: "Define one activation moment.", text: "Align your entire onboarding flow around a single, undeniable win in session one (for Disco, saving the first pin)." },
          { lead: "Clarify the architecture first.", text: "Make sure users understand where their effort goes before asking for heavy commitments." },
          { lead: "Design for rapid iteration.", text: "Clear UX architecture, component states, and validation guides let founders build and test quickly in AI tools like Codex." },
        ],
      },
      {
        kind: "section",
        label: "Strategy",
        title: "Retention cannot fix a product if users drop off before experiencing its core value",
        paragraphs: [
          "When founders see drop-offs after launch, the instinct is to ask what features will bring users back. But a user who hasn't reached first value has nothing to return to. Disco's analytics showed exactly where the flow needed support:",
          "• Registration had near-zero friction: over 94% of users completed their profile.\n• The drop came at the voice call: ~52% began it, while ~44% chose \u201cSkip for now.\u201d\n• Completion tapered on both paths: ~12% of all signups finished the call, and 0% of users who skipped reached personalized recommendations.",
          "The most valuable growth available to any startup is the audience already downloading the app, so we focused the sprint on session-one activation and saved broader retention loops for the 90-day roadmap.",
        ],
      },
      {
        kind: "section",
        label: "Diagnosis",
        title: "High-commitment onboarding and missing session records created immediate user drop-off",
        paragraphs: [
          "We evaluated Disco across client Mixpanel analytics, a 39-screen audit against 11 weighted UX dimensions, 5 moderated user sessions, 24 beta feedback logs, and 5 competitor teardowns. Three areas stood out.",
        ],
      },
      { kind: "step", title: "1. The voice call was a high-commitment ask for session one.", paragraphs: ["A 10-to-15-minute conversation about personal health came before any matched content, creating fatigue before users saw the app's core value."] },
      { kind: "step", title: "2. The call interface was audio-only.", paragraphs: ["With no captions, pause controls, or mute toggle, users in quiet places, on transit, or with hearing differences couldn't complete the consultation comfortably."] },
      { kind: "step", title: "3. The conversation didn't leave a persistent record.", paragraphs: ["Users shared personal health goals but got no saved summary, so their effort felt lost in a black hole."] },
      {
        kind: "quote",
        quote:
          "I love seeing that baseline score. Any founder is going to look at that and say, 'That's unacceptable, this just has to go up.'",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "figure",
        span: "full",
        ratio: "2400x1318",
        caption: "Onboarding, redesigned: the Disco Voice audio preview, a personalized feed, and Pin what resonates.",
        image: "/work/disco-onboarding-poster.webp",
        video: "/work/disco-onboarding.mp4",
      },
      {
        kind: "section",
        label: "The pivot",
        title: "Shifting AI from a mandatory gatekeeper into the engine powering user-driven health discovery",
        paragraphs: [
          "In our first round of design, the AI voice intake had gradually taken center stage. But Disco was always meant to be a health discovery engine with AI powering it. Users don't open an app just to talk to AI; they open it to get clarity on their health.",
          "In Week 2, we mapped the product into three cooperating surfaces:\n• Disco Voice: the conversational intake, repositioned from a mandatory gatekeeper into a guided consultation users feel prepared for.\n• Disco Chat: the home for written interaction, conversation recaps, and matched recommendations.\n• Boards and Pins: a personal library of verified health answers, products, and clinician options.",
          "Reviewing this in lo-fi, before any visual design, gave Eris the clarity to rename the product from GenWell to Disco around one promise: \u201cClarity for every health decision.\u201d We then anchored the redesign on the first pin in session one, the explicit signal that what users see is relevant to their health.",
        ],
      },
      {
        kind: "quote",
        span: "body",
        quote:
          "The low fidelity was such an important step for us to go through together. I would have hated for you to design … without us having that touch point.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "section",
        label: "Execution",
        title: "Five targeted interventions gave users total control and an immediate path to their first pin",
        paragraphs: ["Each decision ships with a hypothesis and measurement plan in the Validation Guide."],
      },
      { kind: "step", title: "1. Let users hear Disco Voice before committing to the call.", paragraphs: ["A sample audio preview plays on the value-proposition screen, before the microphone request. Users who tried the voice assistant loved it; new users hesitated because they didn't know what it sounded like."] },
      { kind: "step", title: "2. Deliver personalized value on the delay path.", paragraphs: ["\u201cSkip for now\u201d became \u201cMaybe later,\u201d routing users through a 3-topic selector that seeds their feed right away. Users get value without an awkward 15-minute call, and in-feed prompts bring them back to it later."] },
      { kind: "step", title: "3. Add captions, pause controls, and plain-language privacy guidance.", paragraphs: ["Real-time captions, a pause button, and clear helper text on how health data is stored and edited. Users can finish the intake discreetly anywhere, on transit or at work, with peace of mind about sensitive data."] },
      { kind: "step", title: "4. End the call with a recap card inside Disco Chat.", paragraphs: ["The call flows straight into a summary card linking key insights to matched videos, vetted products, and care providers. Users leave with a health summary they can re-read and share with their doctors."] },
      { kind: "step", title: "5. Make the first pin the primary win, and boards the reason to return.", paragraphs: ["An explicit Pin button replaces the ambiguous \u201c+\u201d icon and saves content into personal boards. Each pin signals the content is relevant, and turns passive browsing into a health library users come back to."] },
      {
        kind: "figure-row",
        span: "body",
        figures: [
          { ratio: "1200x1500", caption: "Pins, the health profile, topic picker and the Pin button in the feed.", image: "/work/disco-cards.webp" },
          { ratio: "1200x1500", caption: "Disco Voice with captions, pause and end.", image: "/work/disco-voice-poster.webp", video: "/work/disco-voice.mp4" },
        ],
      },
      {
        kind: "quote",
        quote: "It did pretty well on the first pass, telling Codex to read the Figma file and bringing designs straight in.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "split",
        label: "Outcome",
        title: "A structured design architecture and strategic roadmap to empower rapid iteration",
        paragraphs: [
          "AI coding tools make code generation fast, but they can't tell you what to build or why users leave. Clear global styles, component states, and annotated flows let Eris translate the design into code with Codex and stand up a TestFlight build within two weeks of handoff.",
          "The redesign targets a re-score of 70+ on the same 11 dimensions, with an instrumentation plan tracking activation, the delay path, first return, and call completion. Next, Eris can test key decisions against the Validation Guide's hypotheses, then ship validated updates in small batches through the 90-day roadmap.",
        ],
      },
      {
        kind: "quote",
        span: "body",
        quote:
          "They analyzed our entire product, tore it down to the nails, and then rebuilt a workflow that we're super excited to use.",
        name: "Eris Hanson-Cooper",
        role: "Founder & CEO, Disco",
      },
      {
        kind: "section",
        label: "Partner spotlight",
        title: "Building in lockstep with Eris Hanson-Cooper",
        paragraphs: [
          "Transformation at this speed is only possible when a founder brings clarity of vision, decisiveness, and a willingness to test and iterate. From embracing the audit's findings, to pivoting the brand at the lo-fi review, to spinning up a TestFlight build within two weeks of handoff, Eris was a true co-creator.",
          "We're honored to be part of Disco's journey as they transform how women discover personalized health solutions.",
        ],
      },
    ],
  },
};
