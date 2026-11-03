# Design: move the free Activation Scorecard (page + backend) to www.sarisari.design

## Context
The free Activation Scorecard currently lives entirely on the separate `activation-diagnostic-landing-page` app (`activation-diagnostic.sarisari.design`): the `/preview` form page, the `/api/scorecard-request` route (Attio capture + dedupe, then FireCrawl → Claude → Supabase → Resend in `after()`), and the hosted result pages at `/s/<slug>`. The user wants it on the main site at `www.sarisari.design/scorecard-preview`. They chose to move the **whole backend** too, so www owns the scorecard end to end.

Decisions made in brainstorming:
- Page is **standalone** (Wordmark linking `/` + form, no site nav/footer), same as today.
- Old `/preview` gets a **permanent redirect** to www.
- Result pages **move to www** at `/s/<slug>` (noindex). Old subdomain `/s/*` links redirect to www so emails already sent keep working.
- The diagnostic landing page's "Try it for free" modal becomes a **plain link to the www page**. The scorecard code is then deleted from the diagnostic repo, leaving one copy.
- Paid deliverables at `/reports/<slug>/` stay on the diagnostic app (out of scope).

## Part 1: www repo (this workspace), one PR

**Dependencies:** add `@anthropic-ai/sdk`, `@supabase/supabase-js`, `zod` (same versions as the diagnostic repo).

**Port verbatim, then adapt imports** (source: `~/Workspaces/sarisari/01_Code/activation-diagnostic-landing-page`):
- `src/lib/scorecard/*`: `analyze.ts`, `decide.ts`, `email.ts`, `formValidation.ts`, `pipeline.ts`, `store.ts`, `store.memory.ts`, `store.supabase.ts`, `store.sql`, `types.ts`, plus all `*.test.ts`. The lib has no app-specific imports beyond itself.
- `src/app/api/scorecard-request/route.ts`. Keep the logic as-is: honeypot, validation, Attio-note dedupe, best-effort Attio capture, `after(runAnalysisAndEmail)`, `runtime = "nodejs"`, `maxDuration = 300`. www's `src/lib/attio.ts` is shaped around the contact form, so the route keeps its own Attio calls rather than being forced through that helper.
- `src/app/s/[slug]/page.tsx` + `src/components/scorecard/report/ScorecardReport.tsx` (self-contained HTML/CSS report; only imports `types`).
- `src/components/scorecard/ScorecardForm.tsx` + `ScorecardCover.tsx`. Page variant only: drop the modal-only pitch pane, `ScoreGauge`, `ScorecardModal`, `ScorecardCta`, `Scorecard.tsx`. Repoint `Button`, `Wordmark`, `Section` to www's components and reconcile prop differences with www's `Button` API. Fetch `"/api/scorecard-request"` (no trailing slash; www doesn't use `trailingSlash`).
- Scorecard copy (`diagnostic.scorecard`: eyebrow, cover, page meta, headline, body, form, confirmation, duplicate, error, legal) → a `scorecard` export in `src/content/site.ts`. The confirmation screen's booking button uses www's existing diagnostic booking URL constant.

**URL updates inside ported code:**
- `pipeline.ts` `reportBaseUrl()` default → `https://www.sarisari.design`.
- `ScorecardReport.tsx:782` link to the diagnostic stays absolute (`https://activation-diagnostic.sarisari.design`), since that's the paid-offer page.

**New page:** `src/app/scorecard-preview/page.tsx`, standalone layout with `bg-neutral-100`. Metadata via `src/lib/metadata.ts` helper with the existing title/description, canonical `/scorecard-preview`, indexable.

**Config:** in `next.config.mjs`, add a `headers()` entry for `/s/:path*` with `X-Robots-Tag: noindex, nofollow` (page metadata also sets robots noindex).

**Links:** `SCORECARD_URL` (`src/content/site.ts:17`) → `"/scorecard-preview"`; update `e2e/home.spec.ts:38`.

**Tests:** ported unit tests run under www's vitest. Add a route test alongside `src/app/api/contact/route.test.ts` style: honeypot, 400 on bad input, 200 when Attio key is unset. Add an e2e check in `e2e/pages.spec.ts` that `/scorecard-preview` renders the form.

## Part 2: Vercel (manual, before merging Part 1)
On the www Vercel project, copy env vars from the diagnostic project: `ATTIO_API_KEY` (likely already set), `FIRECRAWL_API_KEY`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SCORECARD_MODEL`, `SCORECARD_COOLDOWN_DAYS`. Set `SCORECARD_PUBLIC_BASE_URL=https://www.sarisari.design`. Confirm fluid compute is enabled so `maxDuration = 300` applies. I can check and set these through the Vercel MCP if you approve; the values come from the diagnostic project, not from me.

## Part 3: diagnostic repo, separate PR (ship after Part 1 is live)
- `next.config.mjs` `redirects()`: `/preview/` → `https://www.sarisari.design/scorecard-preview` and `/s/:slug` → `https://www.sarisari.design/s/:slug`, both permanent. Remove the now-dead `/s/:path*` noindex header.
- Replace the "Try it for free" modal (`ScorecardCta`/`ScorecardModal`) with a link to `https://www.sarisari.design/scorecard-preview`.
- Delete `src/app/preview`, `src/app/s`, `src/app/api/scorecard-request`, `src/lib/scorecard`, and the now-unused scorecard components and content. Drop `@anthropic-ai/sdk`, `@supabase/supabase-js`, `zod` if nothing else uses them.
- Remove the scorecard env vars from the diagnostic Vercel project afterwards.

## Execution order
1. Save this design to `docs/superpowers/specs/2026-10-28-scorecard-to-www-design.md`, commit, then use superpowers:writing-plans for the step-by-step plan and execute it TDD-style.
2. Part 1 PR → Vercel preview deploy with Part 2 env vars → verify → merge.
3. Part 3 PR in the diagnostic repo → merge.

## Verification
- `npm run typecheck && npm test && npm run test:e2e` in www.
- `npm run dev`: screenshot `/scorecard-preview` against the live page for visual parity; check that site CTAs point to it.
- On the www Vercel preview: submit with a test email and a real URL. Confirm the 200 response, the Attio person + "Free Activation Scorecard request" note, a new Supabase row, the email arriving with a `www.sarisari.design/s/<slug>` link, and that the link renders with a noindex header. Resubmit with the same email to see the "duplicate" state.
- After Part 3: `curl -sI` on `activation-diagnostic.sarisari.design/preview/` and an existing `/s/<slug>` both return a 308 to www. The landing page button opens the www page.
