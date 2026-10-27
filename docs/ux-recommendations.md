# Website UX Recommendations — sari-sari-website.vercel.app

**Date:** Oct 26, 2026 · **Goal:** site is ready for paid-ad traffic (Google Search live Nov 1).
**Reviewed:** live Vercel build (desktop 1440 + mobile 390), `src/content/site.ts`, `src/app/page.tsx`, DESIGN.md, PRODUCT.md, copy-deck.md, CCP (Oct 22), ICP H&W, current-offers.md, 21-Day Diagnostic landing copy, WIP Visual Style Guide (PDF), old sarisari.design.
**Priority:** P0 = before ads go live · P1 = within the 6-week ads test · P2 = after.
**Sources key:** CCP §n = `current-client-profile(2026-10).md` · SG = WIP Style Guide · LP = `activation-diagnostic-landing-copy.md`.

---

## 0. Decisions only Patti/Zach can make (blocks some items below)

| # | Decision | Rec | Why |
|---|---|---|---|
| D1 | Who the homepage speaks to | **Resolved Oct 26 → see Messaging map below.** Seed–Series A, any industry, H&W as specialty | CCP covers Diagnostic clients only, so it shapes the Diagnostic page, not the whole homepage. |
| D2 | Front-door offer for ad traffic | **Resolved Oct 26:** squeeze page with all offers (Kocah strategist) | Small budget + unknown audience → let visitors self-select; the clicks tell you which offer they want. |
| D3 | Retainer pricing shown | Grow $8K / Scale $16K (your Oct 20 call: keep Grow/Scale, all prices public) | Site shows only $16K. current-offers.md lists $8K/$16K. |
| D4 | Build price | Pick one: $24K/90 days (current-offers.md) vs $8K–16K/mo (Sep notes) vs "Let's talk" (site) | Three sources disagree. |
| D5 | The $1,500 "Audit" card | Cut it, or rename to the free Scorecard | Card says $1,500 but CTA says "Try it for free" → links to free Scorecard. Not on the offer ladder. |
| D6 | Style guide vs DESIGN.md (rounded/pills/orange vs sharp/index column/one accent) | Go back to the style guide (see §5) | DESIGN.md's only rationale is "warmer temperature" — warmth is already carried by paper tones, Editorial Old italic, and the hanging-photo hero. |
| D7 | Nora quotes on the site | Ask her (NV-01, NV-03 are strong) | Only Eris (DI-) and Michael (SV-) have blanket approval. |

---

## 1. P0 — Launch blockers (functional + trust)

1. **Hide the annotation toolbar on production.** Where: floating "Agentation" button bottom-right on every page. Why: visible to every visitor today; should only load with `?annotate`.
2. **Add analytics + conversion tracking.** Where: `layout.tsx`. GA4 (or Vercel Analytics) + a booking event. Why: zero analytics on the new site; ads can't be measured and CCP §12 can't be filled without it.
3. **Pass UTMs/gclid into Calendly.** Where: `BOOKING_URL` in `site.ts`. Why: every CTA leaves the site; without pass-through you can't tell which ad booked a call. Use `02_Areas/04_marketing/utm-conventions.md`.
4. **Fix meta title + description.** Where: `layout.tsx`. Now: "Senior product design & development for growth-stage software companies… fractional product team." Why: contradicts the hero and the ad copy; hurts ad landing-page relevance and link previews.
5. **Real Privacy + Terms pages.** Where: `/privacy`, `/terms` (both say "Full policy copy pending"). Why: required once analytics/cookies run; cold ad visitors check.
6. **Remove every "pending" placeholder from public view.** Where: hero wall (Lendzi, GenWell, "Portfolio piece" — 3 of 6 cards), Recent Projects (GenWell image + "Case study coming soon" ×2), testimonials (7 of 9 cards read "QUOTE PENDING"). Why: placeholders read as unfinished to a stranger; ship only what's real.
7. **Substantiate or reword "Trusted by 20+ global teams."** Where: hero marquee label. Truthful fallback: "Teams we've designed for." Why: flagged ⚠️ in site.ts; logos also need permission (Lendzi, Silk & Sonder, Lions & Lambs, Selfbook).
8. **Reword "team of senior-level product designers" / "Senior product experts."** Where: Services intro, Pricing feature 01. Truthful version: "Senior-led. Every project is directed by Patti (15+ years in product and brand design)." Why: contractor model; claim must hold if a client asks who's on it.
9. **Fix pricing contradictions.** Where: Pricing. Headline "No guesswork. One price." sits above four prices; Audit card $1,500 vs "Try it for free" (D5). Why: the one section ad traffic scrutinizes most.
10. **Mobile pricing panel overflow.** Where: Retainer panel at 390px — feature rows clip on the right ("Design systems built to scale" cut off), "/ month" wraps under the price. Why: broken layout on phones, where many ad clicks land.
11. **Load the paid fonts.** Where: `/public/fonts` — Instrument Serif/Sans + Space Grotesk are rendering. Why: already on `docs/dns-cutover-checklist.md`; the brand's display face isn't actually live.

## 2. P0 — Copy: say the right words to the right person

12. **Hero subhead.** Now: "A product design studio that helps you acquire, convert, and retain more customers." Rec: "You built it fast. Now people sign up and don't stick. We find where they drop off and fix it." Why: CCP §4/§7 ("people were confused," "we lose a lot of people before starting a trial"); "acquire" = ads, a non-public partner service (current-offers.md).
13. **Keep the hero headline** "Design that turns sign-ups into regulars." Why: names the CCP problem, ties to sari-sari/suki, carries over from the current live site.
14. **Add a secondary hero CTA: "Get your free Activation Scorecard."** Where: hero, next to the booking CTA. Why: cold ad visitors need a low-commitment step (CCP §12: no one has evaluated SSD cold yet); old site had "Get a free diagnostic."
15. **One CTA label sitewide.** Now: "Let's chat," "Book a call," "Book an intro call" (+ "Book a discovery call" on the Diagnostic page). Rec: "Book a 30-min call" everywhere, with "Half an hour, no deck." microcopy under the hero button. Why: one action should have one name.
16. **Rewrite FAQ "Do you only work with health and wellness?"** Now ends "Any growth-stage consumer software company…". Rec: match D1 wording. Why: contradicts the audience everywhere else.
17. **Add two FAQs from the CCP.** "We built it with Lovable/Codex/Claude. Can you work with that?" (all 4 CCP clients built with AI) and "We don't have much data yet. Does this still work?" (answer already written in LP §10). Why: these are the objections this audience actually has.
18. **Remove "Branding & marketing support" from Services** (or rename "Landing pages & launch assets"). Why: services guardrails: branding is subcontracted, ad creative is conditional, and current-offers says "do not lead with these."
19. **Cut or source "$400K+ loaded."** Where: "Versus hiring a Head of Design." Why: unsourced number; also the CCP founder isn't hiring a Head of Design.

## 3. P1 — Section reorg

Current order: Hero → Recent Clients (wall) → Services → Recent Projects → Pricing → Team → Testimonials → FAQ → CTA.

Recommended:

| # | Section | Change | Why |
|---|---|---|---|
| 01 | Hero | Subhead + 2 CTAs + logo row (items 12–14) | First 5 seconds = problem + low-risk next step |
| 02 | **Sound familiar?** (new) | 3–4 symptoms in CCP language: users sign up and drift · you can't tell if your data means anything · it "feels off" but you can't say why · the AI-built shortcuts stopped scaling | SG voice rule "name the problem before the solution"; CCP §4, §7. The old site had this section ("The growth-stage design gap") |
| 03 | Work | **Merge** "Our Recent Clients" + "Our Recent Projects" into one section; hanging-wall hero lands here; only real pieces | Same images appear twice now; duplication reads as thin |
| 04 | Proof | Move testimonials up, right after Work; add Eris quotes (approved): DI-01 "unblocked a huge work stream so quickly and efficiently," DI-10 "the priority order makes it really digestible," DI-12 "Nothing replaces a designer" | CCP §8: speed, priority order, human judgment are what clients value. Proof should sit next to the work |
| 05 | **Start here: the 21-Day Diagnostic** (new, replaces the unrendered retainer "double diamond") | 5 deliverables + 3-week timeline, lifted from LP §3 and §5 | CCP §8: "work they can act on right away." `process` in site.ts exists but isn't rendered, and it describes the retainer |
| 06 | **Why a human, not another AI pass** (new; replaces the 4 "Versus…" FAQ rows) | Add "Versus asking your AI tool to fix it" as the lead comparison | Positioning amendment: the moat is trusted judgment. CCP DI-12, SV-02, NV-11. The "Versus" rows aren't questions and are buried in the FAQ |
| 07 | Services | Collapse to "After the Diagnostic: what we build"; outcome-led titles | Capability menus are agency-speak (SG DON'T list) |
| 08 | Pricing | Ladder in order: Free Scorecard → Diagnostic $6K → Build → Grow/Scale retainer (D2–D5) | Matches current-offers.md "every rung ends with a priced next step" |
| 09 | About | Restore the sari-sari origin paragraph + "A short shelf of things we do well, for people we know by name." Currently only "Your team" + photos render | The most memorable, ownable story on the site is missing |
| 10 | FAQ → CTA band | Keep the navy band | Works |

## 4. P1 — UX pass

20. **Hero dead space (desktop).** Where: gap between CTA and logo row at 1440×900. Rec: tighten so the problem section (02) peeks above the fold. Why: the hero is set to stop 150px short "so the next header peeks in," and that header is now a placeholder-heavy wall.
21. **Hero art at mobile.** Where: hanging prints render ~70px tall at 390px. Rec: 2 large prints, not 6 small. Why: unreadable thumbnails aren't proof.
22. **Case study cards that don't link.** Where: Funding Solutions, GenWell. Rec: hide until written, or show a one-line real outcome with no link styling. Why: "Case study coming soon" is a dead end.
23. **Testimonial carousel → static grid of 3.** Why: with 2–3 real quotes, arrows suggest more content than exists.
24. **Retainer CTA buried.** Where: Retainer panel left column, with lots of empty space under it at desktop. Rec: once the Diagnostic leads (D2), the retainer panel becomes a compact card.
25. **Team bios.** Now: "Producer, previously Meta and Disney." / "15+ years of product and brand design." Rec: add one specific credential line each (names of products/companies). Why: ICP — non-design founders judge credibility signals (Meta, Disney).
26. **"Nirvana" typo** in `testimonials.items` placeholder list → Nervana. GenWell now Disco — confirm which name Eris wants public.

## 5. P1 — Visual polish (style guide vs current DESIGN.md)

Current build follows DESIGN.md, which retired several style-guide rules. Rec (D6) restores them; each line = what to change / why.

27. **Corners → 0px buttons, 0–4px cards/images.** Now: pills, 8px cards, 16px images. Why: SG "Bold = sharp corners," "Avoid rounded 8px+." Pills + soft cards are the default SaaS template look; "not trying to look like everyone else" (SG p1).
28. **Restore the index column as the signature device (01, 02, 03… in Col 1).** Now: only in the Services rows. Why: memory brand spec + SG "Asymmetry by default… index numbers appear first, then content populates." This is the one form that makes the site recognizable — exactly the "memorable, cohesive" ask.
29. **One accent.** Now: blue + orange dash/eyebrows + green. Rec: drop orange; eyebrow dash in ink blue. Why: SG "One electric accent, used selectively"; finalized palette is ink blue #1F5FA6 / deep green #2E6B45 — no orange.
30. **Logo marquee → static row.** Why: SG Motion Don'ts: "No looping ambient animations on primary UI surfaces."
31. **Case card hover zoom (scale 1.04) → border/background shift.** Why: SG "Cards: never lift or float," "no scale transforms."
32. **Team photos: warm color, not grayscale.** Why: SG photography "warm, high-contrast; DON'T cool-toned or desaturated." Grayscale on peach reads dated.
33. **Hero reveal timing:** headline → subhead +100ms → CTA +200ms. Why: SG website motion spec; current reveal is one block.

## 6. P2 — After the ads test

34. Write Funding Solutions + Lendzi case studies (problem/change/number) — then add to Work.
35. Kenchan case: figure images + captions (still placeholders).
36. Fill CCP §11–13 from ad results and first paid client, then re-check hero copy against it.
37. Update stale docs so future threads stop pulling wrong info: PRODUCT.md + copy-deck.md still say "growth-stage," "fractional product team," Diagnostic $2,500.

---

## Docs status (for the next thread)

- **Current, use these:** CCP (Oct 22), WIP Style Guide (PDF), current-offers.md, activation-diagnostic-landing-copy.md, site.ts.
- **Stale, don't trust:** PRODUCT.md, copy-deck.md (positioning + $2,500 price), brand-voice.md (superseded by the style guide), offers.md.
- **Conflicts inside the ICP:** ICP H&W disqualifies "no real users / pre-seed," but 2 of 4 CCP clients were pre-launch or ~100 users. D1 decides which wins on the site.
- **Not found:** testimonial bank (`04_marketing/testimonials/testimonial-bank.md` isn't in the vault or Notion). Quote IDs above come from the CCP.
