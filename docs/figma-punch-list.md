# Figma Punch List — for Patti

What the Sari-Sari DS file (`dwD1O65d5WHCKBIlPiXSmm`) needs so it matches the shipped site and stays usable as the design source going forward. None of this blocks the website — the code at `04_Code/website` is the canonical token source (see `src/app/globals.css`). This list closes the loop the other way.

## 1. Resolve placeholder copy on "IN PRODUCTION ZACHHHH GOES HERE"

- [ ] Hero: drop the `v1:` prefix from the headline text layer
- [ ] section-differentiator headline: replace "Differentiator? Expand on hero…" — site shipped *"We close the gap between a great product and a shipped one."* (pending your review in `content/copy-deck.md`)
- [ ] section-work headline: replace "Something about problems + work we like to solve" — site shipped *"Work that moves the numbers that matter."*
- [ ] section-work cards: 8 dummy "Funding Solutions" cards → real set (Kenchan Ramen / Funding Solutions / Lendzi / Your Project)
- [ ] Conversion-UX + Team sections: both reuse the differentiator body paragraph — replace with distinct copy (drafts in copy deck §5, §7)
- [ ] Team: "Zach"/"patricia" cards share one dummy bio — real bios (drafts in copy deck)
- [ ] FAQ: 8 accordions read "Label Text" — real Q&A shipped on the site (copy deck §9)
- [ ] Testimonials: "Review" placeholder cards → real quotes (Jed G. shipped; 2 more needed + permissions)
- [ ] Case study figure captions: all 6 figures read "Fig 01" with a copied intro sentence

## 2. Bind layers to variables (worst offenders)

The token system (01 primitives / 02 alias / 03 mapped) is solid — but the comps mostly bind to **alias** tokens directly and skip the **03 mapped** layer entirely (e.g. text uses `color/neutral/800` instead of `text/primary`). Recommended pass:

- [ ] Hero headline has **no text style** applied (raw 120px) — apply `lite/dsply/lg` (or `md`)
- [ ] Team "Zach"/"patricia" name layers have no text style — apply `lite/head/h2-em`
- [ ] Sweep for hard-coded fills: nav glass bar uses raw `#faf8f880` — bind to `color/neutral/light-50`
- [ ] Decide: comps bind to mapped tokens (`text/primary`, `surface/page`) or alias is the contract. The site's CSS assumes **alias** is the contract — if you agree, document that in the User Guide page; if not, tell Zach and the CSS gets a mapped layer too.

## 3. Componentize repeated sections

- [ ] `card-project` (work grid) — 8 detached copies → component with image/title/props
- [ ] `par-set`, `figure-block`, `stat-block` (case study) — components, so the Funding Solutions article can be assembled from instances
- [ ] `index` rail + `gridlines` — shared components across sections
- [ ] nav + footer — components (currently per-frame copies)

## 4. File hygiene

- [ ] Detach unused community libraries: Material 3 Design Kit, iOS 18, iOS 26 (none of their components are used by the site comps; Simple Design System — check before removing)
- [ ] `dimension/400` variable has value **280** — misnamed; rename to `dimension/280` (xl-desktop main-padding aliases it)
- [ ] Page-list naming: "IN PRODUCTION ZACHHHH GOES HERE" → something durable like "WEBSITE — SHIPPED v1" once live
- [ ] Mobile frames: optional — the site derives mobile in code; add comps only if you want to control specific breakpoints

## 5. Assets to place (both Figma and site need them)

See `docs/asset-inventory.md` for the full table: hero float image, 7 marquee logos, differentiator image, 3 project card covers, 3 testimonial images, 2 team photos, 7 case-study figures, and the original Noise & Texture raster + wordmark SVG exports (site currently uses a CSS-generated grain + text-rendered wordmark as stand-ins). The **PORTFOLIO** page is a likely source for project/case-study imagery.
