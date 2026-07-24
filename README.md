# sarisari.design

The Sari Sari Design marketing site — a self-hosted **Next.js** app that replaces the old Webflow site.

Live host target: **Vercel** (project `sari-sari-website`). Domain cutover from Webflow is a separate, gated step — see `docs/dns-cutover-checklist.md`.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- Deployed on **Vercel** (`vercel.json` → `framework: nextjs`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

## Where things live

| Area | Path |
|---|---|
| Design tokens (colors, type scale, fonts) — **canonical source** | `src/app/globals.css` |
| Homepage sections | `src/app/page.tsx` |
| Homepage copy/content model | `src/content/site.ts` (mirrors `content/copy-deck.md`) |
| Kenchan Ramen case study | `src/app/work/kenchan-ramen/page.tsx` + `src/content/kenchan.ts` |
| Reusable components | `src/components/` (`Section`, `Nav`, `Button`, `Accordion`, `FooterCta`, `Wordmark`, `Placeholder`) |
| Legacy Webflow URL redirects | `next.config.mjs` |
| Launch docs | `docs/` (asset inventory, DNS cutover, Figma punch list) |

## Design source

The design lives in Figma (`Sari-Sari DS`, file `dwD1O65d5WHCKBIlPiXSmm`) and a Paper mirror
(`Sari Sari Website`, file `01KVV52G8FVGXPR5FAT40KP9NX`). Design tokens in `src/app/globals.css`
are the canonical values; the design files get backfilled to match (see `docs/figma-punch-list.md`).

### Iteration pipeline

1. Iterate the design in **Paper** / Figma.
2. Port changes into code — tokens in `src/app/globals.css`, copy in `src/content/*.ts`, layout in `src/app/page.tsx`.
3. Push to `main` → Vercel builds a deploy automatically.
4. When ready to go live, run `docs/dns-cutover-checklist.md`.

## Known follow-ups before production

Tracked in `docs/`: purchase/host the paid webfonts (PP Editorial Old / Neue Montreal / Supply)
into `public/fonts/` (free fallbacks render until then), place real imagery, add legal copy to
Terms/Privacy, and confirm contact email + social URLs in `src/content/site.ts`.
