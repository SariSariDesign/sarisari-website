# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: founders and product leaders at **growth-stage software companies** — teams
with a live product, real users, and more roadmap than capacity, who need senior
product design *and* development without building a full in-house team. They are
hiring for outcomes (activation, conversion, retention, satisfaction), not
decoration, and want a partner who can both design and ship.

Focus segment: **growth-stage consumer software**. Health and wellness is where
**much of our work has been** — because trust and retention are the whole business in
that category, and those are the problems the studio is best at — but it is no longer
the exclusive focus. Any growth-stage consumer software company with the same
pressures is a fit.

Not a fit: pre-product-market-fit teams, "we need a logo" brand work, or companies
looking for someone to manage an existing design org.

## Product Purpose

Sari Sari Design is a **fractional, embedded product design and development team** for
growth-stage software companies. It owns the full product lifecycle — user research
through front-end build — running in parallel on a client's highest-priority
workstreams so nothing stalls waiting for the right hire. Success = the client's
tracked numbers move (activation, conversion, retention, satisfaction) and the product
looks as legitimate as the business has become.

## Positioning

"**Your fractional product team.**" Senior product design & development for
growth-stage software companies — an embedded team working continuously on the
client's roadmap, not an agency that scopes a project, delivers mockups, and moves on,
and not juniors behind a senior's title slide. Differentiators the site asserts (the
"Why Sari Sari?" comparison):

- **Versus hiring a Head of Design:** live in weeks, not a six-month, $400K+ hire, and
  one team covers both design and development; we help you hand off to an in-house team
  when the time is right.
- **Versus a dev shop:** they build what they're told; nobody owns whether it converts.
  We bring product judgment first, then write the code ourselves.
- **Versus a brand agency:** no handoff cliff and no invoice-per-revision; we ship
  working product and stay after launch.
- **Versus patching it yourself:** the most expensive option, because it never ends.

The studio ships the front-end itself ("what we design is what goes live, on your
stack"), works measured against real metrics, and prices plainly with no long-term
contract.

## Operating Context

- One-pager marketing site (`sarisari.design`) with anchor sections, in this order:
  **Hero → Services → Work → Process → Why Sari Sari? → About → Pricing → FAQ →**
  closing navy **CTA** band + footer. Plus standalone case-study pages
  (`/work/kenchan-ramen`).
- **Two ways in:** the monthly **Retainer** (primary), and the **Activation
  Diagnostic** as the try-first funnel — a shorter, lower-commitment engagement that
  lives at `activation-diagnostic.sarisari.design` and is the top-of-funnel path for
  teams not ready for the full retainer.
- Engagement model: continuous, embedded, month-to-month; works inside the client's
  Slack, Figma, and PM tools; the double-diamond process (below) is judged on whether
  the number moved.
- Intro/booking flow runs through Calendly (`calendly.com/sarisari/30min`); the
  diagnostic CTA points to the diagnostic microsite. Contact email
  (`hello@sarisari.design`) and LinkedIn URL are flagged for confirmation in `site.ts`.
- Migrated off Webflow to a self-hosted Next.js app deployed on Vercel; legacy Webflow
  URLs are redirected.

## Capabilities and Constraints

Six services, design and development in one team, aimed at the four numbers that
decide the next round (activation, conversion, retention, satisfaction):

1. **User research** — talk to actual users, come back with the reason they stall.
2. **UX design** — flows and wireframes for every state, so the funnel stops leaking.
3. **UI design** — screens that make a two-year-old product look like the company it's become.
4. **Design systems** — component library + tokens the team assembles from, so features stop being redesigns.
5. **Prototyping** — test the new flow with real users before an engineer touches it.
6. **Full development** — ship the front-end ourselves, on the client's stack.

**Process — the double diamond, pointed at a metric:** Discover (Week 1) → Define
(Week 2) → Design (Weeks 3–6) → Ship (Weeks 7+).

- Pricing:
  - **Retainer — $16,000 / month**, embedded design + development team, month to
    month, no long-term contract. (Drafted engagement terms in `site.ts`, flagged for
    confirmation: 3-month minimum, 30-day notice to stop/pause, 30-day pause hold,
    ~two-week start lead time.)
  - **Activation Diagnostic — $2,500 / 21 days**, the try-first offer: diagnose,
    redesign, and prototype the highest-impact flow; the client leaves with a working
    prototype, the reasons users stall, and a prioritized roadmap — whether or not they
    keep us on.
- Terminology: "fractional product team," "embedded," "growth-stage," "activation,"
  "double diamond," "the problem, the change, the number."
- Stack constraint: Next.js 15 (App Router) + React 19 + Tailwind v4; canonical design
  tokens live in `src/app/globals.css`.

## Brand Commitments

- Name: **Sari Sari Design** (legal: "Sari Sari LLC"); lowercase italic-serif
  "sarisari" wordmark used as a display device.
- **Central brand metaphor — the sari-sari store (binding, lean into it).** A
  sari-sari store is the small neighborhood shop in the Philippines: it stocks exactly
  what its street needs, and the owner knows every customer by name. That is how the
  studio runs — "a short shelf of things we do well, for people we know by name": a few
  services it's genuinely good at, for a small number of clients it knows well. The
  metaphor now lives in the **About origin paragraph** (kept verbatim in `site.ts`) and
  in the voice; it is durable brand truth, and visual expression is decided in
  DESIGN.md, not here.
- Team, named on-site:
  - **Zach Chaco — Chief Executive Officer.** "Producer, previously Meta and Disney."
  - **Patricia Capiral — Chief Creative Officer.** "15+ years of product and brand
    design."
- Voice: direct, plainspoken, anti-fluff, confident — and **neighborly**: the warmth of
  a sari-sari-store shopkeeper who knows the community and stocks exactly what it needs.
  Reflected in lines like "Half an hour, no deck" and "The problem, the change, the
  number."
- Typography commitments: **PP Editorial Old** (italic display), **Neue Montreal**,
  **Supply** — the paid primary faces. Not yet hosted; the comp's free Google analogs
  (Instrument Serif / Instrument Sans / Space Grotesk) render as the live fallback until
  the paid faces land in `/public/fonts` (see DESIGN.md).
- Social: LinkedIn `company/sarisaridesign` and contact `hello@sarisari.design` —
  both flagged for confirmation in `site.ts`.

## Evidence on Hand

Real, usable:
- **Kenchan Ramen** case study — the one fully-authored case, rendered on the homepage
  Work section and complete at `src/app/work/kenchan-ramen/`. Sector "DTC food ·
  Shopify"; problem/change/metric narrative around a bundle-builder validation test;
  headline metric **37% of digital revenue**; stat stack +8.1% AOV lift YoY / <1 hour
  to first conversion / 711 bundle redemptions.
- **Jed G., Kocah** — verbatim testimonial, treated as cleared (from the Kenchan case).
- **Trusted by 20+ global teams** marquee — logos (Lendzi, SignalVerified, Silk &
  Sonder, Lions & Lambs, Selfbook) and the "20+" claim are drafted and flagged for
  permission/substantiation in `site.ts`.

Named but limited / pending (do NOT fabricate):
- **Work cases 2 & 3** (Funding Solutions / Lendzi) — only Kenchan is fully authored;
  the homepage renders only complete cases. Cases 2 & 3 await real problem/change/metric
  narrative — tracked in `content/copy-deck.md`.
- Additional testimonials, real client/tool logos, team photos, Kenchan figure images,
  and Terms & Privacy legal copy are still needed.

## Product Principles

1. **A short shelf, done well** — the sari-sari-store ethos: a few services the studio
   is genuinely good at, for a small number of clients it knows by name. Not
   diversification for its own sake.
2. **Move the number** — design and development judged against the metrics the client
   already tracks; each process phase is a win only if the number moved.
3. **Legitimacy is a deliverable** — the interface must signal the trust the business
   has earned; craft is the proof.
4. **Ship, don't scope** — embedded and continuous; design carries through to
   front-end build on the client's stack.
5. **Senior hands only** — dedicated senior designers and engineers who operate with
   in-house ownership, not a rotating cast of contractors.

## Accessibility & Inclusion

Open decision *(inferred — no product-specific standard was confirmed).* Suggested
target: **WCAG 2.1 AA** for the marketing site and case studies. The redesign's motion
(scroll-reveal, marquee) is already gated behind `prefers-reduced-motion`. Confirm the
overall target before binding future work to it.
