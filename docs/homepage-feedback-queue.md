# Homepage feedback queue (from wireframe v17, Oct 27)

Base: https://sari-sari-website.vercel.app/?annotate
Source of truth: SSD Website UX Strategy doc + wireframe v17 (approved copy).
Work one batch at a time: implement → `npm run dev` → check localhost:3000 → commit.
Copy lives in `src/content/site.ts`; layout in `src/app/page.tsx` + components.

**Rules for every batch (clean code, no breaks):**
1. Change things at the source: tokens in `globals.css`, shared components (`Section`, `Gridlines`, `Reveal`, `Button`), copy in `site.ts`. Never patch a single element when a shared rule covers it.
2. No one-off overrides: no `!important`, no arbitrary values when a token exists, no duplicate components.
3. Delete what's replaced (headline A/B/C/D switcher, `Regulars` wall, Why/Process content, dotted grid). Don't hide it.
4. Keep tests passing (`npm test`) and `npm run build` clean before showing the local copy.
5. One commit per batch, so any batch can be rolled back alone.
6. If an item conflicts with existing code or another item, stop and ask. Don't guess.
7. Annotate selectors (when given) show WHERE it looks wrong; fix it at the source per rule 1.

---

## Batch 1–3 fixes (Oct 27, paste before Batch 4)

### F1. Type scale (replaces Batch 1 #5)
**Location:** type tokens in `globals.css`, `SectionHeader`, hero `h1`, `FooterCta`
**Feedback:** Replace the display/heading/body tokens with this scale. Sizes step at <768 / 768–1023 / 1024–1439 / ≥1440.
| Token | Use | <768 | 768–1023 | 1024–1439 | ≥1440 | Font · line height · tracking |
|---|---|---|---|---|---|---|
| display-l | Hero headline, belief statement, closing headline | 48 | 64 | 112 | 144 | Editorial Old Ultralight · 0.96 · −3% |
| display-m | Every section heading | 36 | 48 | 64 | 72 | Editorial Old Ultralight · 1.04 · −2% |
| display-s | Prices, stats | 40 | 44 | 56 | 72 | Editorial Old · 1.0 · −2% |
| heading-l | Accordion titles, principle titles | 24 | 26 | 32 | 40 | Neue Montreal 400 · 1.2 · −1% |
| heading-m | Card/tile titles, offer names, team names, FAQ questions | 20 | 22 | 24 | 28 | Neue Montreal 400 · 1.2 · −1% |
| lead | Hero subhead, section intros, Scale description, closing subhead | 18 | 20 | 22 | 24 | Neue Montreal 400 · 1.4 |
| body | All other copy | 16 | 16 | 18 | 18 | Neue Montreal 400 · 1.45 |
| body-s | "Best for" lines, credit note | 14 | 14 | 14 | 14 | Neue Montreal 400 · 1.4 |
| label | Eyebrows, kickers, tags, buttons, nav, names/roles in attributions | 12 | 12 | 14 | 14 | Supply caps · 1.2 · +4% |
No display-xl. Delete tokens that no longer map to a role.

### F2. Full-height sections + scroll snap (new foundation)
**Location:** `Section.tsx`, `globals.css`
**Feedback:** Every section is at least 100svh tall with its content vertically centered, and scrolling settles at section starts: `html { scroll-snap-type: y proximity }`, each section `scroll-snap-align: start`. Use proximity, not mandatory, so sections taller than the screen (Services open, Pricing, FAQ) still scroll freely. Section padding 40–72px (clamp). Add a `hug` option to `Section`: no min-height, generous padding instead (top/bottom clamp 80–160px). Under `prefers-reduced-motion`, turn snapping off.

### F3. Hero headline (corrects Batch 3 #14)
**Location:** `Hero()` in `page.tsx`
**Feedback:** The headline spans the full 12 columns above the 60/40 split, at display-l (2 lines on desktop). Eyebrow sits above it. Subhead + CTAs (60%) and prints (40%) sit below. The hero should fit one viewport at 1440×900.

### F4. Accordion rules span the full grid
**Location:** `Accordion.tsx` (shared by Services and FAQ)
**Feedback:** When an item opens, its divider stops short of the grid width. Put the border on the item wrapper, not on the answer/content block, so every rule runs 100% of the content grid, open or closed. Keep answer text capped at ~68ch.

---

## Batch 1 · Foundations (everything else sits on these)

### 1. Grid
**Location:** `Section.tsx`, hero/regulars wrappers in `page.tsx`
**Feedback:** Follow Grid Specs: inner container max-width 1200px, 16px padding left/right, 16px gutters everywhere (replace `px-6 md:px-8` and `gap-6/gap-8`). Columns: 12 at ≥1024px, 8 at 768–1023px, 4 below 768px. Left padding widens to clear the tick nav (64px on tablet; on desktop the outer margin must clear it). Common spans: halves 6+6, thirds 4+4+4, editorial text 8 cols.

### 2. Gridlines: visible, Stripe-style, 12 columns
**Location:** `Gridlines.tsx`, `.gridlines` in `globals.css`
**Feedback:** Replace the 6-column dotted grid. Lines sit on the 1200px measure: solid 1px lines at the outer edges, dashed lines (4px dash / 5px gap) every 3 columns (8-col: every 2; 4-col: center only). Color `neutral-400` so it reads on purpose, like Stripe's old grid. On entering view, lines draw top-down (scaleY 0→1, 600ms ease-out), once. Hide gridlines on the three "moments": hero, belief statement panel, closing band. Cards and surfaces get a solid background so lines never run through them.

### 3. Grain on moments only
**Location:** `globals.css` (new `.grain` utility), hero, statement panel, closing band
**Feedback:** Film grain (SVG fractal noise, multiply) at 10% opacity on the hero, the belief statement panel and the closing CTA band only. Nowhere else, never on cards or controls.

### 4. Corners: sharp
**Location:** `Button.tsx` (rounded-full), case study + services + team images (rounded-2xl), pricing cards and testimonial cards (rounded-lg), testimonial arrows and avatar (rounded-full), `Nav.tsx` pill, mobile menu (rounded-2xl), `DESIGN.md` radius tokens
**Feedback:** 0px everywhere: buttons, cards, images, arrows, nav, menus. Update `DESIGN.md` tokens to match (tag/card/image 0, no pill) and its gutter to 16px.

### 5. Type scale
**Location:** `SectionHeader`, hero `h1`, new statement panel, `FooterCta`
**Feedback:** Three steps, existing tokens only. Display (hero headline, belief statement, closing headline): `text-display-l`, clamping down on mobile. Section headings: `text-display-s` (as now). Body: `text-body-m`. Labels, eyebrows, tags, buttons: Supply (`ds-label`).

### 6. Motion system: "stock the shelf"
**Location:** `Reveal.tsx`, `[data-reveal]` rules in `globals.css`, `page.tsx`
**Feedback:** On entering view (trigger at 80% viewport): gridlines draw (item 2), then the section's eyebrow and heading rise 12px + fade (400ms ease-out), then items fill in left to right, 60ms apart, capped at 300ms total. Once per section, no reverse on scroll-back. Statement panels fade only (no Y movement on text). Hero on load: eyebrow 0ms, headline +80ms, subhead +180ms, CTAs +280ms. `prefers-reduced-motion`: everything shows in its final state. Nothing delays content past 600ms.

### 7. Hover rules
**Location:** `CaseStudyCard` (`scale-[1.04]`, shadow badge), `Button.tsx`, cards
**Feedback:** No scale, no lift, no shadow anywhere. Cards: thin border reveal (1px ink) or background color shift, 150ms ease-out. Buttons: background shift, 150ms. Arrow icons may nudge 2px.

### 8. Line icons
**Location:** use-case buttons (new), case study arrows, carousel arrows
**Feedback:** 2px monoline, square caps, no fill. Each icon's stroke draws once when it enters view (400ms ease-out), then nudges on hover (150ms): down-arrow 2px down, ↗ arrow 2px up-right.

### 9. Logo marquee
**Location:** `Marquee.tsx`, hero logo strip
**Feedback:** Keep the loop, but contain it inside the 1200px measure with faded edges (not full-bleed). Slow (~40s per cycle), pauses on hover, static under reduced motion.

---

## Batch 2 · Page structure + navigation

### 10. Section order
**Location:** `Home()` in `page.tsx`
**Feedback:** New order: Hero → Use cases (new) → Services → Work → Point of view (new) → Testimonials → Pricing → Team → FAQ + closing CTA. Remove the "Our Recent Clients" gallery wall (`Regulars` section); the hero prints now land in the use-case cards. Remove any leftover Why/Process sections.

### 11. Tick nav (new)
**Location:** new component, fixed to the left browser edge
**Feedback:** Stripe Press-style table of contents, ≥768px only. One horizontal tick per section, no column, rule or background. Ticks widen toward the hovered or current section (max 48px, −10px per step away, min 14px, 150ms ease-out); current tick in ink, others muted. Desktop: section name beside the hovered/current tick. Tablet: current section number only. Click scrolls to the section. Below 768px: hide it and show a sticky bottom bar instead (current "01 · Hero" label + 9 progress segments).

### 12. Top nav
**Location:** `Nav.tsx`
**Feedback:** Drop the shrinking pill on scroll (rounded-full, shadow, blur, max-width morph). Keep it sticky, full measure, square, 1px bottom border. Links: underline or color change at 150ms. Links: Services, Work, Pricing, About, FAQ; CTA "Book a call".

---

## Batch 3 · Hero

### 13. Hero copy
**Location:** `hero` in `site.ts`, `Hero()`
**Feedback:**
- Eyebrow: "For Seed to Series A founders"
- Headline (replaces the A/B/C/D switcher): "Design that turns users into regulars."
- Subhead: "Sari Sari is a senior-led design and development studio helping founders launch, fix and grow products people trust."
- CTAs: "Book a call" (primary, Calendly) + "Get free Scorecard" (secondary, SCORECARD_URL)
- Logo strip: the 13 clients: Selfbook, Silk & Sonder, Lions & Lambs, SWS Gifts, Liberty Call, Funding Solutions, Lendzi, Signal Verified, NutriSnap, Disco, Nervana, Kenchan, Kocah. No "Trusted by 20+" label.

### 14. Hero layout + prints
**Location:** `Hero()`, `HangingShop.tsx`
**Feedback:** Split 60/40 text to prints (not 50/50). Prints may overlap slightly to stay compact. Stop the looping sway: prints settle once on load. On scroll, the Disco, NutriSnap, Funding Solutions and Kenchan prints lose their clips and drop into use-case cards 1–4 (ease-out, no bounce or spring); the other prints fade. Reduced motion: images sit static in the cards. Grain on, gridlines off (Batch 1).

---

## Batch 4 · Use cases (new) + Services

### 15. Use cases section (new)
**Location:** new section after Hero
**Feedback:** Uses the `hug` section option (F2): height hugs the content, generous top/bottom padding. Header "How can we help?" (display-m). Four cards in a row (2-up tablet, 1-up mobile): image on top (not behind text), problem line, outcome line that shows on hover/focus (always visible on touch), and a square icon button (down arrow) that scrolls to Pricing and highlights ONE offer card with a 2px `primary-400` outline for ~3.5s. Card hover: 1px ink border reveal.
| Card | Image | Problem | Outcome (hover) | Button → |
|---|---|---|---|---|
| 1 | Disco | Users sign up, then disappear | Find where they leave and fix that first. | Activation Audit |
| 2 | NutriSnap | It looks like every other AI-built app | Give it a look and flow that's yours. | Activation Diagnostic |
| 3 | Funding Solutions | You're launching something new | Brand, product and site, designed and built together. | Activation Build |
| 4 | Kenchan | Your roadmap is stuck waiting on a design hire | A senior team that starts in two weeks. | Scale |
Card images need variants so they don't repeat the case study images.

### 16. Services copy + keywords
**Location:** `services` in `site.ts`, `ServicesList.tsx`
**Feedback:** Full-height section (F2). Remove the eyebrow. Headline (display-m, via `SectionHeader`): "Design, research and code under one roof." Intro at lead size. Intro: "Senior designers and developers working on the numbers that matter most: conversion, activation, retention." Each row: title at heading-l, one line at body, keyword tags (Supply label). Rules span the full grid (F4). Replace the bullet dots with tags. Images 0 radius.
1. Digital products: "From idea to a launched product, aimed at the metric your next round depends on." Tags: Product strategy · Product discovery · MVP design · Prototyping · AI product UX · Launch
2. UX/UI design: "Flows and screens that make your product easy to start, and look like the company you've become." Tags: User flows · Wireframes · UI design · Onboarding & activation · Mobile & responsive · Accessibility (WCAG)
3. Design systems: "A component library your developers build from, so new features ship faster and stay consistent." Tags: Component libraries · Design tokens · Figma libraries · Annotated dev handoff
4. User testing & research: "We don't rely on just best practices or AI-generated personas. We watch real users try your product and show you where they stall and why." Tags: Usability testing · User interviews · Competitor analysis · Funnel & analytics review · Activation audits
5. Full-stack development: "We build what we design, on your stack, so it goes live the way it was designed." Tags: Web apps · Front-end & back-end · Shopify · AI features & integrations · APIs & databases · Dev guidance
6. Branding & marketing support: "A brand, site and pitch deck that make an early company look as credible as its product." Tags: Brand identity · Websites · Landing pages · Pitch decks & investor collateral · Launch assets

---

## Batch 5 · Work + Point of view (new)

### 17. Work: "Freshly stocked"
**Location:** `CaseStudies()`, `CaseStudyCard`, `caseStudiesSection` + case-study cards in content
**Feedback:** Headline "Freshly stocked". Three equal tiles (3-up desktop, 2-up tablet, 1-up mobile), no full-width featured card. Each tile: background in the client's brand color, image, client name as an eyebrow above the title, title, project-type tags styled as price labels (Supply caps, 1px ink border, sharp). Whole tile links; ↗ icon top-right. Hover: client color deepens, no zoom.
- Kenchan Ramen: "Building a bundle feature that drove 37% of digital revenue" · E-commerce · Conversion · Shopify
- Funding Solutions: "Turning high-stakes loan ops into a self-serve lending pipeline" · Fintech · 0→1 design · B2B tools (no Lendzi details)
- NutriSnap: "Turning nutrition science into a first session people trust" · Health · Activation · AI-built app (no case study page yet: tile unlinked until it exists)

### 18. Point of view (new)
**Location:** new section after Work
**Feedback:** Full-page statement panel: min-height 100svh, 12 cols, left-aligned, Editorial Old at display size, grain on, gridlines off, fade only.
- Line 1 (roman): "AI makes building easy."
- Line 2 (italic): "We make it clear: what's wrong, what to fix first, and why."
- Hand-drawn SVG underline under "clear": 2px `primary-400`, organic stroke, draws left to right (stroke-dashoffset, 800ms ease-out) when the panel's center hits the viewport center. Draws once, positioned relative to the word so it scales.
Then the principles, pinned: the principles block sticks to the viewport (sticky, 100svh) while the section scrolls ~2.6 screens. P1 scrolls up into place, then P2 under it, then P3, each driven by scroll position (ease-out, no bounce). Once P3 is in, the whole block scrolls away together. Each principle is one full-width row: title (heading-l) in 5 cols, body in 7 cols, 1px ink rule above. Mobile: title above body. Reduced motion: all three shown static, no pin.
1. **Machine speed, human curation.** Generative tools handle the heavy lifting of production. We provide the vision, direction, and editorial discipline to ensure the final product actually matters.
2. **Trust at every touchpoint.** Just as sari sari stores run on familiarity and trust, we design the critical micro-moments that turn first-time users into regulars, from fintech to health to e-commerce.
3. **Evidence over instincts.** We put interactive flows in front of actual users, watch where they hesitate, and fix that first. We test our instincts against real behavior, then build what holds up.

---

## Batch 6 · Testimonials + Pricing

### 19. Testimonials
**Location:** `testimonials` in `site.ts`, `TestimonialCarousel.tsx`
**Feedback:** Headline "Ask our regulars." (display-m). One-row carousel: 3 visible on desktop, 2 tablet, 1 + peek mobile; square arrows top-right. **Scroll-driven at ≥768px:** the section pins (sticky, 100svh) and vertical scrolling moves the carousel sideways; the section is exactly as tall as needed for the last card to reach the grid's right edge, then it scrolls away. Arrows scroll the page by one card. Mobile and reduced motion: normal swipe carousel, no pin. Quotes at body size, names at label size. Order and exact text (no IDs):
1. Eris Hanson-Cooper · Founder & CEO, Disco: "The speed of delivery and the quality of delivery is so excellent. You guys unblocked a huge work stream so quickly and efficiently."
2. Michael Campbell · CEO, Signal Verified: "The five findings are spot on, and the usability session data makes them hard to argue with... The things I knew felt off but couldn't articulate this clearly. Your diagnostic gave me a clear punch list to work from. Highly recommend giving your process a shot; you have nothing to lose."
3. Nora Rabah Rodden · Founder, Nervana: "Sari Sari provided a much-needed, research-informed refresh for my live mobile app. They not only helped tear down every single screen, but also suggested helpful recommendations which were simple to test. I am so grateful they spent the time to dive into every detail and ask clarifying questions along the way - I felt they really understood my business and objectives."
4. Jed G. · Cofounder, Kocah: "Sari Sari didn't just execute a feature request—they reframed it into a validation question and shipped proof in a day. That bundle test went on to become one of the most reliable revenue levers in our digital channel."
5. Jherray Babida · President, Social Wine & Spirit: "The appearance of my company now is just so much more professional thanks to the amazing talents of the Sari Sari designers…"
Steve (NutriSnap) and Steve C. (Lions & Lambs) are pending: hide until approved. Remove all other placeholder entries.

### 20. Pricing
**Location:** `pricing` in `site.ts`, `Pricing()`, `RetainerPanel`
**Feedback:** Layout (≥1024px): left 4 columns hold the headline "Ready to get started?" (display-m) and the free Scorecard card, sticky while you scroll; right 8 columns hold the Scale card, then the three offers as full-width rows (not 3-up cards). Each offer row: kicker + name (heading-m) left, price (display-s) right; description + "Best for" below left (max 60ch), CTA bottom right; 32px padding, 1px rules between rows, 48px gap above the rows. Scale card padding 48px. Below 1024px everything stacks: headline, Scorecard, Scale, offers. Remove "Not ready for a retainer? Start smaller."
Scale card (solid `primary-400` background, light text, the one accent surface): kicker "Ongoing · 3-month minimum" · "Scale" · "$16K/mo" · "Ongoing design and development on an open roadmap. You set the direction." Bullets: One senior team for design and code · We join your standups, reviews and user tests · Starts within two weeks · 3-month minimum, then 30 days notice. "Best for: high-velocity teams that need flexible, ongoing design and engineering." Link: "Design only? Grow, $8K/mo →". CTA "Book a call".
Offer cards (3-up), each: kicker, name, price, description, best-for line, "Book a call":
- 7 days · Activation Audit · $1,500 · "Discover where users leave in any single flow. Get a scorecard and teardown of that flow with prioritized recommendations." · "Best for: something's off but you need clarity."
- 21 days · Activation Diagnostic · $6,000 · "Find the biggest problem in any single flow and see the fix. Get a redesigned prototype, a validation guide and a 90-day roadmap." · "Best for: you want the fix designed and tested before investing in development."
- 90 days · Activation Build · Let's talk · "Ship one defined project in 90 days. We design and build it, or guide your developers through it." · "Best for: one defined project, like a launch or redesign." · "Diagnostic fee credited if you start within 30 days"
Scorecard card (left column, dashed border): "Free" badge · kicker "In minutes" · "Activation Scorecard" · "Drop in your URL to get your activation score and the top 5 points of friction keeping visitors from signing up. Free, in minutes." · CTA "Get free Scorecard" (SCORECARD_URL).
Each card needs an id so the use-case buttons can highlight it.

---

## Batch 7 · Team, FAQ, closing

### 21. Team
**Location:** `about` in `site.ts`, `About()`
**Feedback:** Headline "Who you'll work with". Zach first.
- Zach Chaco · CEO & Co-Founder · "Runs every engagement. Previously Meta, Disney."
- Patricia Capiral · Head of Design & Co-Founder · "Directs every project. Previously Selfbook, Silk & Sonder, Guess."
Photos in warm color, not grayscale; 0 radius. Line under: "Los Angeles & San Diego · Pacific Time".

### 22. FAQ
**Location:** `faq` in `site.ts`, `Faq()`
**Feedback:** Eyebrow "FAQ", headline "Before you book". Replace the list with these 11, in order (the four "Versus…" items are folded into #5):
1. How soon can you start? — Usually within two weeks of a signed agreement. The Audit and Diagnostic can start sooner. We keep a limited number of clients, so we'll confirm your date on the call.
2. How do you work with our developers? — Two ways. We design and hand your developers annotated files they can build from, and stay on hand while they build. Or our developers build it with you, on your stack.
3. What's the difference between Build and Grow/Scale? — Build is one defined project on a set 90-day timeline. Grow and Scale are ongoing, with an open roadmap you steer month to month. Grow is design; Scale is design and engineering.
4. Does the Diagnostic fee count toward Build? — Yes. Sign Build within 30 days of your Diagnostic delivery and the fee is credited toward it.
5. Why you instead of AI tools, a freelancer or a hire? — We use AI tools every day to move faster, and we're accountable for what to build and what to cut. A freelancer gives you one person's hours; a senior hire takes months to find. We're a senior design and development team that can start in two weeks.
6. What do we need ready before starting? — A decision-maker who can join a weekly review, access to your analytics and users, and one owner on your side for approvals. We handle the rest of setup in week one.
7. Who owns the files and IP? — You do, once each invoice is paid. Design files, code and research live in accounts you control, and they stay yours if we stop working together.
8. What if it isn't working? — You give 30 days notice and stop paying, with no wind-down fees or penalties. We'd rather part cleanly than hold a client who isn't getting value.
9. Can we pause the retainer? — Pause anytime. We hold your slot for 30 days. After that we may fill it, and you'd restart when one opens.
10. What happens when we hire our own designer? — We hand over everything: files, design system and context, so your new designer starts where we left off.
11. Do you only work with health and wellness companies? — No. A lot of our work is in health, fintech and e-commerce, where users have to trust a product before they come back. We work with founders in any industry.
Accordion open/close: 250ms ease-in-out. Rules span the full grid (F4). Questions at heading-m, answers at body.

### 23. Closing CTA
**Location:** `footerCta` in `site.ts`, `FooterCta.tsx`
**Feedback:** Full-width near-black (`neutral-1000`) band with grain, headline at display-l. Scroll snaps to the band start (F2). Headline: "Tell us what you're building, or where it's stuck." Subhead: "Thirty minutes. We'll tell you what we'd change first, and whether we're the right team to do it." CTAs: "Book a call" (light) + "Get free Scorecard" (outline).
