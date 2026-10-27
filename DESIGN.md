---
name: Sari Sari Design
description: Warm editorial serif meets Swiss utility, sharp corners, an orange accent, and quiet reveal motion for a senior product studio
colors:
  ink: "#403e3c"
  ink-strong: "#1f1d1c"
  paper: "#faf9f7"
  warm-grey: "#efeeed"
  peach: "#fff2e5"
  muted: "#575452"
  placeholder: "#999693"
  primary: "#1f5fa6"
  primary-deep: "#054285"
  navy: "#002752"
  primary-mid: "#4987cc"
  primary-tint: "#c4dbf5"
  primary-pale: "#ebf4ff"
  accent: "#d68f49"
  accent-soft: "#ebae71"
  accent-deep: "#b86e25"
  amber-bg: "#f7e7c6"
  amber-text: "#8a5e06"
  success: "#1d8f65"
  success-deep: "#086643"
  success-pale: "#edfcf7"
typography:
  display:
    fontFamily: "PP Editorial Old, Instrument Serif, Playfair Display, Georgia, serif"
    fontSize: "120px"
    fontWeight: 400
    lineHeight: "120px"
    letterSpacing: "-2px"
  headline:
    fontFamily: "PP Editorial Old, Instrument Serif, Playfair Display, Georgia, serif"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: "56px"
    letterSpacing: "0px"
  title:
    fontFamily: "Neue Montreal, Instrument Sans, Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: "32px"
  body:
    fontFamily: "Neue Montreal, Instrument Sans, Inter, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "0.25px"
  label:
    fontFamily: "Supply, Space Grotesk, Space Mono, ui-monospace, monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "2px"
rounded:
  tag: "0px"
  card: "0px"
  image: "0px"
spacing:
  gutter: "16px"
  side-padding: "16px"
  columns: "12 (≥1024px) / 8 (768–1023px) / 4 (<768px)"
  section-y: "96px"
  section-y-lg: "144px"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-primary-active:
    backgroundColor: "{colors.navy}"
  button-secondary:
    backgroundColor: "{colors.primary-pale}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "16px 32px"
  button-white:
    backgroundColor: "#ffffff"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "16px 32px"
  button-ghost:
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    padding: "0px"
---

# Design System: Sari Sari Design

## Overview

**Creative North Star: "The Conversion Editorial, warmed up."**

Sari Sari's world still reads like a design-forward business broadsheet: an oversized
italic serif carries the emotion, a precise neo-grotesque carries the argument, and
an uppercase mono/grotesque stamps every label like a spec sheet. It is confident and
plainspoken — a studio that treats its own site as proof of craft.

What the redesign changes is the *temperature*. The old system was clinical: strict
square corners, film grain, exposed gridlines, numbered section rails, and saturated
full-bleed blue/green bands. The new comp keeps the editorial rigor but softens the
delivery. Corners stay sharp (0px everywhere). A warm **orange accent**
appears functionally — the eyebrow dash, process numerals, the highlighted case
metric — as a third voice alongside blue. Surfaces breathe across a warm neutral
rhythm (paper → warm grey → peach) with a deep navy closing band. Structure is now
signalled by a quiet **eyebrow-dash header device** rather than numbered rails, and
the page comes alive with subtle **scroll-reveal** motion and a **logo marquee**.
Film grain stays dropped, but the structural gridline returns in a softer key: a
faint **dotted column grid** now runs the full page as a quiet underlay behind
content — the old exposed hard rules reinterpreted as low-contrast dots.

The anti-reference is still the generic SaaS landing page — gradient blobs, glow
accents, heavy multi-layer drop-shadows, glassy 3D. Rounded corners and motion are
now welcome; decoration for its own sake is not.

**Key Characteristics:**
- Warm neutral canvas with a section rhythm of paper / warm-grey / peach, closing on a deep navy CTA band and a near-black footer
- Oversized editorial-serif italic display against a Swiss sans body
- Uppercase mono/grotesque labels as a persistent "spec sheet" device
- Sharp corners everywhere (0px): buttons, cards, images, tags
- Orange as a functional third accent (eyebrow dash, process numerals, case metric, amber sector tags)
- Eyebrow-dash section headers (orange dash + uppercase label + serif headline)
- Quiet motion: scroll-reveal fades and a logo marquee, both off under reduced-motion
- Stripe-style gridlines on the 12-column measure (solid edges, dashed every 3 columns, `neutral-400`), drawn on enter; off on the three moments
- Largely flat still — separation comes from color, hairline borders, and radius, not heavy shadow

## Colors

The palette is **unchanged** — every color below already exists in the DS ramps in
`globals.css` (grey / blue / green / orange / yellow / red). What the redesign
changes is *application*: which ramp steps become surfaces, and the new functional
role for orange.

### Primary
- **Editorial Blue** (#1f5fa6, `primary-400`): primary buttons, links, tab-active
  fill, and hover accent on nav links. Deepens to **#054285** (`primary-500`) on
  hover and **#002752** (`primary-600`) on active/press.
- **Navy** (#002752, `primary-600`): now an *active surface* — the full-bleed
  closing CTA band. Light text and the `primary-200/300` steps carry copy on top of it.
- **Sky Mid / Tint / Pale** (#4987cc / #c4dbf5 / #ebf4ff): text and fills on blue
  surfaces, plus the pale-blue "secondary" button skin.

### Accent (new functional role)
- **Orange** is the third accent, used functionally, never decoratively:
  - **#d68f49** (`orange-400`) — the eyebrow accent dash on every section header.
  - **#ebae71** (`orange-300`) — the large process step numerals.
  - **#b86e25** (`orange-500`) — the highlighted case-study metric (e.g. "37%").
  - **#fff2e5** (`orange-100`) — the peach **About** band background, and the
    Diagnostic "Try us first" tag.
- **Amber sector tags** use `yellow-200` (#f7e7c6) bg + `yellow-600` (#8a5e06) text
  on the work case rows.

### Neutral (the surface rhythm)
- **Paper** (#faf9f7, `neutral-100`): the base canvas and alternating section bg.
- **Warm Grey** (#efeeed, `neutral-200`): the alternate section bg (Services,
  Process, FAQ) and the retainer pricing panel.
- **Peach** (#fff2e5, `orange-100`): the About band.
- **Ink / Ink Strong** (#403e3c / #1f1d1c): body text and highest-contrast headings.
  `neutral-1000` (#1f1d1c) is also the footer surface.
- **Muted** (#575452, `neutral-700`) / **Placeholder** (#999693, `neutral-600`):
  secondary text, labels, and placeholder captions.

### Secondary
- **Evergreen** (`success` ramp): retained in the tokens for success/positive states
  and legacy `Placeholder` tones, but no longer a homepage band. The green Team band
  is gone — Team/About now lives on the peach band.

### Named Rules
**The Warm-White Rule (kept).** The canvas is Paper (#faf9f7), never #ffffff. Pure
white is used only for raised cards (service cards, the diagnostic panel) to lift
them a half-step off the warm-grey/paper ground.

**The Surface-Rhythm Rule (new, replaces the Two-Band Rule).** Sections alternate
paper → warm-grey → paper, with peach reserved for About and navy reserved for the
closing CTA. The old strict "blue default / evergreen once, never a third saturated
color" rule is **retired** — orange is now a sanctioned functional accent, and
saturated full-bleed bands are limited to the single navy CTA.

## Typography

**Display Font:** PP Editorial Old — licensed paid webfont, the primary face.
**Body Font:** Neue Montreal — licensed paid webfont, the primary face.
**Label/Mono Font:** Supply — licensed paid webfont, the primary face.

**Google-fallback note (new).** The three paid faces are not yet hosted in
`/public/fonts`. The comp's free Google analogs are now wired as the **live
fallback** and render today: **Instrument Serif** (display), **Instrument Sans**
(body), and **Space Grotesk** (labels), loaded via `next/font` in `layout.tsx` and
exposed through CSS-var stacks in `globals.css`
(`--font-brand` / `--font-body` / `--font-code`). `font-display: swap` keeps the
fallback visible until the paid `.woff2` files land, at which point the paid faces
take over with no code change. The three type *roles* are unchanged.

**Character:** An emotive high-contrast serif for feeling, a rational Swiss grotesque
for reading, and a mechanical mono/grotesque for structure — three voices with
clearly divided jobs. The italic serif is the signature (the hero headline is set in
the editorial *italic*).

### Hierarchy
- **Display** (400, 72–120px `display-m`/`display-l`, tight line-height, −1/−2px
  tracking): hero headline (rendered `italic`, `clamp(44px,8vw,120px)`), the navy CTA
  headline, and the About pull-quote; serif only.
- **Headline** (400, 56px `display-s` / 48px `h1` / 40px `h2`): section headlines and
  case-study client names; serif.
- **Title** (500, 24px `title-l` / 18px `title-m`): card titles, sub-heads, FAQ
  questions; sans.
- **Body** (400, 22px `body-l` / 18px `body-m` / 14px `body-s`): running copy; sans.
- **Label** (400, 16px `label-l` / 14px `label-m` / 10px `label-s`, wide tracking,
  UPPERCASE): eyebrows, nav, button text, tags, indices, card metadata;
  mono/grotesque only (`.ds-label`).

### Named Rules
**The Spec-Label Rule (kept).** Every label, eyebrow, nav item, button, tag, and
index number is `.ds-label` (Supply/Space-Grotesk, uppercase, wide-tracked). Labels
are never set in the serif or the sans.

**The Italic-Serif Rule.** The editorial italic is the display signature: the hero
headline, the About pull-quote, the case metric, and the navy CTA headline all render
in italic serif.

## Layout

Content sits on the 1200px measure (`.measure`) with 16px side padding and 16px
gutters. Columns: 12 at ≥1024px, 8 at 768–1023px, 4 below 768px. The left padding
widens to clear the tick nav (64px on tablet; on desktop the outer margin + padding
never drops below 64px). Common spans: halves 6+6, thirds 4+4+4, editorial text 8 cols
(`.cols-8`). Vertical rhythm is `py-24` (96px) per section. The hero sits on the same
measure.

**Eyebrow-dash headers replace numbered rails; the dotted grid returns.** Every
section opens with the shared `SectionHeader`: an `Eyebrow` (orange dash + uppercase
label), a serif `display-s` headline, and an optional body-l intro — all wrapped in a
`Reveal`. The old absolutely-positioned numbered index rail ("01"…"08") stays retired.
`<Gridlines>` runs inside every `Section` (see Gridlines below); `.grain` is for the three moments only.

**Section background rhythm:** Hero (paper) → Services (warm-grey) → Work (paper) →
Process (warm-grey) → About (peach) → Pricing (paper) → FAQ (warm-grey) → CTA (navy)
→ Footer (near-black). The former standalone **Why Sari Sari?** section is gone — its
four comparison rows now live inside the FAQ accordion. Multi-column grids collapse to
a single stack below `sm`/`md`; work case rows alternate image side (`flip`) at `lg`.

## Elevation & Depth

Still largely flat, but the depth cues changed. **Film grain is gone** from the
homepage (the dotted column grid returns as a faint structural underlay, not a depth
cue — see Layout). Separation now comes from:
- **Sharp surfaces + hairline borders:** cards and pricing panels are white, 0px
  radius, with a 1px `neutral-300` border. Feature rows and process steps use hairline `neutral-400`
  dividers.
- **Color surfaces:** the warm neutral rhythm and the peach/navy bands do the heavy
  separation work.
- **Subtle reveal motion** (see Motion) instead of texture.
- The only true "lift" is the sticky nav, which is transparent over the hero and
  gains a `neutral-100/90` `backdrop-blur` background + hairline on scroll.

### Named Rules
**The Quiet-Elevation Rule (replaces No-Shadow).** Surfaces stay flat — no heavy or
glowing drop-shadows. To separate an element, change the background, add a hairline
border, or lean on radius. A single soft shadow on a raised card is acceptable if
ever needed, but color + border + radius is the default.

## Shapes

**Sharp corners.** 0px radius everywhere: buttons, cards, images, arrows, nav,
menus, tags. No pills. Borders stay hairline (1px): `neutral-300` around cards,
`neutral-400` for dividers. Hover never scales, lifts or adds shadow: cards reveal a
1px ink border or shift background (150ms ease-out); buttons shift background (150ms);
arrow icons may nudge 2px.

**Grain on moments only.** `.grain` (SVG fractal noise, multiply, 10%) on the hero,
the belief statement panel and the closing band. Never on cards or controls. These
three moments also drop the gridlines.

## Components

### Button (`Button.tsx`)
- **Shape:** sharp (0px), `.ds-label` uppercase text + a trailing
  arrow-right SVG (`gap-2`), `focus-visible` 2px offset outline in `primary-300`.
  `large` = `px-8 py-4`, `medium` = `px-6 py-3`.
- **Variants:**
  - `primary` — Editorial Blue bg, paper text; hover `primary-500`, active `primary-600`.
  - `secondary` — pale-blue (`primary-100`) bg, blue text; hover `primary-200` (hero "See our work").
  - `white` — white bg, navy text; hover `primary-100`. Used on the navy CTA band.
  - `ghost` — text-only blue, no padding, no pill; hover `primary-500`. Inline CTAs ("View case study", "See the diagnostic").
- **Hover:** the trailing arrow nudges right (`translate-x-1`, 150ms ease-out) — the shared button micro-interaction across every variant.

### Eyebrow (`Eyebrow.tsx`, new signature)
- The section-header device: a `h-0.5 w-6` **orange-400 dash** + `.ds-label`
  uppercase `neutral-600` label. Present on every section.

### Cards / Containers
- **Service cards:** white, `rounded-lg`, `neutral-300` border, index label + sans
  title + body-s.
- **Case rows:** two-column at `lg` (16px-rounded image placeholder + text column),
  alternating sides; amber sector tag, serif client name, problem/approach copy, an
  italic orange metric, a 3-up stat grid, an optional bordered blockquote, and a
  ghost CTA.
- **Pricing panels:** `rounded-2xl`; retainer on warm-grey, diagnostic white with a
  `neutral-300` border.

### Accordion (`Accordion.tsx`, FAQ)
- Single-open list divided by hairline `neutral-300` top/bottom borders. Row header is
  a **sentence-case sans question** (`title-m`, not uppercase) with a `+ / −` glyph
  toggle; body drawer is `body-m`, `whitespace-pre-line`. Opens index 0 by default;
  clicking the open row closes all. (Note: this differs from the old uppercase-label
  Services/pricing accordion — the FAQ is the only accordion on the homepage now.) The
  list now also carries the four former **Why Sari Sari?** comparison rows ("Versus
  hiring a Head of Design.", etc.) after the standard questions.

### PricingTabs (`PricingTabs.tsx`)
- A `role="tablist"` **segmented control**: two pill segments inside a rounded
  `neutral-200` track with a hairline `neutral-300` border. The active segment is a
  **white pill with a soft shadow** and `primary-500` text; the inactive is
  `neutral-700` (hover `neutral-1000`). Labels: "One stop shop" (Retainer, default) /
  "Single Project" (Diagnostic). The Retainer panel carries an "Ongoing Partnership"
  `.ds-label` subtitle above the price.

### Reveal (`Reveal.tsx`, new)
- Client wrapper that adds `.in` when the element scrolls into view via
  `IntersectionObserver` (threshold 0.1, revealed once). Falls back to instant reveal
  when IO is unavailable; CSS disables the transition under reduced-motion.

### Marquee (`Marquee.tsx`, new)
- Duplicated logo strip animated with the CSS `marquee` keyframe (`translateX(-50%)`),
  seamless loop, `--mqdur` speed (40s default), pauses on hover, edge-faded with a
  horizontal mask, `aria-hidden`. Renders each client's **grey silhouette logo mark**
  (`/public/logos/*.png`, `h-6`, 60% opacity); a `mark: null` entry falls back to the
  uppercase name (`.ds-label`). Disabled under reduced-motion.

### Navigation (`Nav.tsx`)
- Sticky, **transparent over the hero**, gaining a `neutral-100/90` `backdrop-blur`
  background + hairline `neutral-300` border once scrolled past 24px. Left: the
  "sarisari" SVG wordmark (see Wordmark). Right: `.ds-label` uppercase links
  (`neutral-800`, hover `primary-400`), then a small **availability indicator**
  (green `success-400` dot + `.ds-label` "1 spot left in …", `lg`+ only), then a
  `medium` pill CTA. Below `md` the links collapse behind a "Menu"/"Close" toggle into
  a paper drawer.

### Image Placeholder (`Placeholder.tsx`)
- Default `hatch` tone: a **diagonal-hatch** stand-in (repeating `-45deg` stripes in
  `grey-200`/`grey-300`), `rounded-2xl`, with a centered `.ds-label` caption. Legacy
  solid `neutral`/`blue`/`green` tones remain for other pages. Keeps `role="img"` +
  `aria-label`.

### Wordmark (`Wordmark.tsx`)
- The **"sarisari" SVG logo** (vectors exported from the DS Figma), rendered at `1em`
  tall with `fill: currentColor` so it inherits the surrounding text color —
  `neutral-1000` in the nav, `neutral-100` in the footer.

### Gridlines (`Gridlines.tsx`, signature)
- Stripe-style lines on the 1200px measure, `neutral-400`: solid 1px at the outer
  edges; dashed (4px dash / 5px gap) every 3 columns at 12-col, every 2 at 8-col,
  center only at 4-col. Each section's lines draw top-down once on enter (scaleY 0→1,
  600ms ease-out). Rendered inside every `Section` (`aria-hidden`, no pointer events,
  under `z-[1]` content); cards keep a solid background so lines never run through
  them. Off on the hero, statement panel and closing band.

## Motion (new)

Motion is quiet, purposeful, and always disabled under `prefers-reduced-motion:
reduce`:
- **"Stock the shelf" reveal:** triggers once at 80% of the viewport. Gridlines draw,
  then the eyebrow + heading rise 12px and fade (400ms ease-out, +100ms), then items
  fill in left to right from +200ms, 60ms apart, capped at 300ms (`<Reveal stagger>`).
  Statement panels fade only. Nothing waits past 600ms. Hero on load: eyebrow 0ms,
  headline +80ms, subhead +180ms, CTAs +280ms.
- **Line icons:** 2px monoline, square caps; stroke draws once on enter (400ms), then
  nudges 2px on hover (150ms).
- **Logo marquee:** a continuously scrolling, hover-pausing, edge-faded strip.
- **Smooth scroll:** `scroll-behavior: smooth` on `html`, also gated behind
  `no-preference`.
- **Micro-transitions:** 150ms color transitions on buttons, tabs, and nav; the
  button's trailing arrow nudges 2px right on hover.

## Do's and Don'ts

### Do:
- **Do** keep the canvas warm Paper (#faf9f7) and use the paper / warm-grey / peach /
  navy surface rhythm for section separation.
- **Do** open every section with the Eyebrow device (orange dash + uppercase label +
  serif headline).
- **Do** use orange functionally — eyebrow dash, process numerals, the case metric,
  amber sector tags — and keep it an accent, never a field.
- **Do** set every label, eyebrow, nav item, button, tag, and index in `.ds-label`
  uppercase.
- **Do** keep every corner sharp (0px) — buttons, cards, images, tags, nav, menus.
- **Do** keep motion subtle and honor `prefers-reduced-motion`.
- **Do** run the Stripe-style gridlines (`Gridlines`) in every section except the three
  moments, on the 12/8/4-column measure.

### Don't:
- **Don't** put film grain anywhere but the three moments (hero, statement panel,
  closing band), and never on cards or controls. Numbered section rails stay retired.
- **Don't** scale, lift or shadow anything on hover.
- **Don't** use pure white as a page canvas (raised cards only), gradients, glow, or
  heavy multi-layer drop-shadows.
- **Don't** turn orange into a full-bleed band or let it compete with blue as a
  primary — it's the accent, blue is the primary, navy is the one saturated band.
- **Don't** set body or label copy in the serif, or headlines in the mono/grotesque.
- **Don't** set FAQ questions in uppercase — the homepage accordion is sentence-case
  sans.
