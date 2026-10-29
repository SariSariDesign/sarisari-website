# Scorecard → www Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the free Activation Scorecard (form page, submit API, analysis pipeline, hosted result pages) from www.sarisari.design, with the form at `/scorecard-preview`.

**Architecture:** Port the scorecard code from the `activation-diagnostic-landing-page` app into this Next 15 app mostly verbatim. Pipeline lib → `src/lib/scorecard`, API → `src/app/api/scorecard-request`, result page → `src/app/s/[slug]`, form → `src/components/scorecard`. Only the form UI is adapted, to use www's design tokens. Spec: `docs/superpowers/specs/2026-10-28-scorecard-to-www-design.md` (Part 1 only; Parts 2 and 3 are manual/other-repo).

**Tech Stack:** Next 15 app router, React 19, Tailwind v4, vitest 4 (jsdom default), Playwright, `@anthropic-ai/sdk`, `@supabase/supabase-js`, `zod`.

## Global Constraints

- Source repo (read-only): `SRC=/Users/zach/Workspaces/sarisari/01_Code/activation-diagnostic-landing-page`
- Form page path: `/scorecard-preview`; standalone layout (Wordmark linking `/` + form, no Nav/footer), indexable.
- Result pages: `/s/<slug>`, noindex (header + metadata).
- `reportBaseUrl()` default: `https://www.sarisari.design`.
- Report's link to the paid offer stays `https://activation-diagnostic.sarisari.design`.
- www has no `trailingSlash`; the client posts to `/api/scorecard-request`.
- Copy is verbatim from the diagnostic repo's `diagnostic.scorecard` block. Confirmation booking button: `DIAGNOSTIC_BOOKING_URL`, label "Book an intro call".
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Dependencies + scorecard pipeline lib

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create (copied): `src/lib/scorecard/{analyze,decide,email,formValidation,pipeline,store,store.memory,store.supabase,types}.ts`, `store.sql`, and tests `{decide,email,formValidation,store.memory}.test.ts`

**Interfaces — Produces:** `runAnalysisAndEmail(lead: ScorecardLead): Promise<void>`, `reportBaseUrl(): string` (pipeline.ts); `getStore()` (store.supabase.ts) with `getBySlug(slug): Promise<StoredScorecard | null>`; `EMPTY_FORM`, `validateScorecardForm(form: FormState): FormErrors`, types `FormState`, `FormErrors` (formValidation.ts); `ScorecardResult` (types.ts).

- [ ] **Step 1: Install deps**
```bash
npm install @anthropic-ai/sdk@^0.115.0 @supabase/supabase-js@^2.111.0 zod@^4.4.3
```
- [ ] **Step 2: Copy the lib**
```bash
SRC=/Users/zach/Workspaces/sarisari/01_Code/activation-diagnostic-landing-page
mkdir -p src/lib/scorecard && cp $SRC/src/lib/scorecard/* src/lib/scorecard/
```
- [ ] **Step 3: Write the failing test for the new report base URL.** Append to `src/lib/scorecard/email.test.ts`, or create `src/lib/scorecard/pipeline.test.ts`:
```ts
// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { reportBaseUrl } from "./pipeline";

describe("reportBaseUrl", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("defaults to the www domain", () => {
    vi.stubEnv("SCORECARD_PUBLIC_BASE_URL", undefined as unknown as string);
    expect(reportBaseUrl()).toBe("https://www.sarisari.design");
  });
  it("honors the env override and strips trailing slashes", () => {
    vi.stubEnv("SCORECARD_PUBLIC_BASE_URL", "https://example.com//");
    expect(reportBaseUrl()).toBe("https://example.com");
  });
});
```
- [ ] **Step 4:** `npx vitest run src/lib/scorecard`. Expected: the "defaults to the www domain" test FAILS (gets activation-diagnostic). If any ported test fails because of jsdom (e.g. `Response`/`fetch` differences), add `// @vitest-environment node` as its first line. Do not change test logic.
- [ ] **Step 5:** In `src/lib/scorecard/pipeline.ts`, change the fallback in `reportBaseUrl()` from `"https://activation-diagnostic.sarisari.design"` to `"https://www.sarisari.design"`.
- [ ] **Step 6:** `npx vitest run src/lib/scorecard && npm run typecheck`. Expected: all pass.
- [ ] **Step 7: Commit** `git add package.json package-lock.json src/lib/scorecard && git commit -m "Port Activation Scorecard pipeline lib from the diagnostic app"`

### Task 2: `/api/scorecard-request` route

**Files:**
- Create: `src/app/api/scorecard-request/route.ts` (copied), `src/app/api/scorecard-request/route.test.ts`

**Interfaces — Consumes:** `runAnalysisAndEmail` from Task 1. **Produces:** `POST` → `200 {ok:true, duplicate:boolean}` | `400 {error}`.

- [ ] **Step 1: Write the failing test** `src/app/api/scorecard-request/route.test.ts`:
```ts
// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const after = vi.fn();
vi.mock("next/server", async (orig) => ({ ...(await orig<typeof import("next/server")>()), after }));
vi.mock("@/lib/scorecard/pipeline", () => ({ runAnalysisAndEmail: vi.fn() }));

const { POST } = await import("./route");

const good = { name: "Ada Lovelace", company: "Engines", email: "ada@example.com", stage: "Seed", url: "engines.io" };
const post = (body: unknown) =>
  POST(new Request("http://localhost/api/scorecard-request", { method: "POST", body: JSON.stringify(body) }));

describe("POST /api/scorecard-request", () => {
  beforeEach(() => vi.stubEnv("ATTIO_API_KEY", ""));
  afterEach(() => {
    vi.unstubAllEnvs();
    after.mockReset();
  });

  it("drops honeypot submissions without queueing analysis", async () => {
    const res = await post({ ...good, faxNumber: "555" });
    expect(await res.json()).toEqual({ ok: true });
    expect(after).not.toHaveBeenCalled();
  });

  it("rejects missing or invalid fields", async () => {
    expect((await post({ ...good, email: "nope" })).status).toBe(400);
    expect((await post({ ...good, url: "localhost" })).status).toBe(400);
  });

  it("accepts a valid lead and queues the analysis when Attio is unset", async () => {
    const res = await post(good);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, duplicate: false });
    expect(after).toHaveBeenCalledOnce();
  });
});
```
- [ ] **Step 2:** `npx vitest run src/app/api/scorecard-request`. Expected: FAIL (cannot resolve `./route`).
- [ ] **Step 3:** `mkdir -p src/app/api/scorecard-request && cp $SRC/src/app/api/scorecard-request/route.ts src/app/api/scorecard-request/`
- [ ] **Step 4:** `npx vitest run src/app/api/scorecard-request`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/api/scorecard-request && git commit -m "Add /api/scorecard-request on www"`

### Task 3: Hosted result page `/s/[slug]`

**Files:**
- Create: `src/app/s/[slug]/page.tsx`, `src/components/scorecard/report/ScorecardReport.tsx` (both copied)
- Modify: `next.config.mjs`

**Interfaces — Consumes:** `getStore().getBySlug`, `ScorecardResult`.

- [ ] **Step 1: Copy**
```bash
mkdir -p "src/app/s/[slug]" src/components/scorecard/report
cp "$SRC/src/app/s/[slug]/page.tsx" "src/app/s/[slug]/"
cp $SRC/src/components/scorecard/report/ScorecardReport.tsx src/components/scorecard/report/
```
- [ ] **Step 2:** Add `headers()` to `next.config.mjs`, after `redirects()`:
```js
  async headers() {
    // Per-lead scorecard reports: unguessable URLs that must stay out of search.
    return [{ source: "/s/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
```
- [ ] **Step 3:** `npm run typecheck`. Expected: PASS. Confirm `ScorecardReport.tsx` still links to `https://activation-diagnostic.sarisari.design` (leave as-is).
- [ ] **Step 4:** `npm run build`. Expected: build succeeds with `/s/[slug]` listed as dynamic (ƒ).
- [ ] **Step 5: Commit** `git add next.config.mjs "src/app/s" src/components/scorecard/report && git commit -m "Host scorecard result pages at /s/<slug> on www (noindex)"`

### Task 4: Scorecard form + `/scorecard-preview` page

**Files:**
- Modify: `src/content/site.ts` (add `scorecard` export), `src/app/globals.css` (add keyframe)
- Create: `src/components/scorecard/ScorecardForm.tsx`, `src/components/scorecard/ScorecardCover.tsx`, `src/components/scorecard/ScorecardForm.test.tsx`, `src/app/scorecard-preview/page.tsx`

**Interfaces — Consumes:** `EMPTY_FORM`, `validateScorecardForm`, `FormState`, `FormErrors` (Task 1). **Produces:** `<ScorecardForm />` (no props), `scorecard` content object.

- [ ] **Step 1: Content.** Copy the `scorecard: { … }` object from `$SRC/src/content/activation-diagnostic.ts` (lines ~308–374) into `src/content/site.ts` as `export const scorecard = { … } as const;`, placed near the other page-content exports. Drop `tryItLabel`, `modalTitle` and `sampleScore` (modal-only). Add `bookLabel: "Book an intro call"`. Update the `SCORECARD_URL` doc comment later, in Task 5.
- [ ] **Step 2: Keyframe.** Append to `src/app/globals.css`:
```css
/* Indeterminate progress bar on the scorecard form's submitting state. */
@keyframes scorecard-load {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}
```
- [ ] **Step 3: Write the failing component test** `src/components/scorecard/ScorecardForm.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScorecardForm } from "./ScorecardForm";

async function fill() {
  const u = userEvent.setup();
  await u.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await u.type(screen.getByLabelText("Company"), "Engines");
  await u.type(screen.getByLabelText("Work email"), "ada@example.com");
  await u.selectOptions(screen.getByLabelText("Funding stage"), "Seed");
  await u.type(screen.getByLabelText(/company website/i), "engines.io");
  await u.click(screen.getByRole("button", { name: /get your free activation scorecard/i }));
}

describe("ScorecardForm", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows validation errors instead of submitting an empty form", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ScorecardForm />);
    await userEvent.click(screen.getByRole("button", { name: /get your free activation scorecard/i }));
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to /api/scorecard-request and shows the confirmation", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true, duplicate: false }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ScorecardForm />);
    await fill();
    expect(await screen.findByRole("heading", { name: "Your scorecard is on its way." })).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/scorecard-request");
  });

  it("shows the duplicate state when the API reports one", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ ok: true, duplicate: true })));
    render(<ScorecardForm />);
    await fill();
    expect(await screen.findByRole("heading", { name: "You've already got one on the way." })).toBeInTheDocument();
  });
});
```
If `@testing-library/user-event` isn't installed (`grep user-event package.json`), add it as a dev dependency or rewrite the steps with `fireEvent` from `@testing-library/react`.
- [ ] **Step 4:** `npx vitest run src/components/scorecard`. Expected: FAIL (module not found).
- [ ] **Step 5: Port `ScorecardCover.tsx`** from `$SRC/src/components/scorecard/ScorecardCover.tsx` with these edits:
  - `import { scorecard } from "@/content/site";` and `const { cover } = scorecard;`
  - `<Wordmark invert className="h-[15px] opacity-90" />` → `<Wordmark className="text-[15px] text-neutral-100 opacity-90" />` (www's Wordmark is `1em` tall and uses `currentColor`).
- [ ] **Step 6: Port `ScorecardForm.tsx`** from `$SRC/src/components/scorecard/ScorecardForm.tsx` with these edits:
  - Imports: remove `Button`'s diagnostic import and the `diagnostic` import; add `import { Button } from "@/components/Button";` and `import { DIAGNOSTIC_BOOKING_URL, scorecard } from "@/content/site";`. Delete the `const { scorecard } = diagnostic;` line.
  - Remove the `variant`, `titleId`, `firstFieldRef` and `onClose` props (page-only). `ScorecardForm()` takes no props; `headingId = useId()`. Drop `onClose` from `ConfirmationScreen` and delete its Close button. In `FormScreen`, delete the `variant` branches and keep the `page` classes: wrapper `"grid items-center gap-8 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:gap-12"`, cover pane `"flex items-center justify-center py-2 md:py-0"`, form pane `"flex flex-col gap-5"`. Drop `ref={firstFieldRef}`.
  - Fetch URL: `"/api/scorecard-request/"` → `"/api/scorecard-request"`, and delete the trailing-slash comment above it.
  - www's `Button` is link-only, so render the submit and retry actions as native buttons sharing one class string:
    ```tsx
    const actionCls =
      "ds-label inline-flex items-center justify-center rounded-full bg-primary-400 text-label text-neutral-100 hover:bg-primary-500 active:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300";
    ```
    Submit: `<button type="submit" className={`${actionCls} w-full px-8 py-4`}>{f.submitLabel}</button>`. Retry: `<button type="button" onClick={onRetry} className={`${actionCls} px-6 py-3`}>{error.retryLabel}</button>`.
  - Confirmation booking link: `<Button href={DIAGNOSTIC_BOOKING_URL} external variant="secondary" size="medium" className="rounded-full">{scorecard.bookLabel}</Button>`.
  - Typography token mapping (the diagnostic → www scale): `text-h2` → `text-heading-l`, `text-label-m` / `text-label-s` → `text-label`, `text-body-m` → `text-body`. `text-body-s`, `font-brand`, `ds-label`, `neutral-*`, `primary-*`, `success-*` and `red-*` exist in www unchanged.
- [ ] **Step 7:** `npx vitest run src/components/scorecard`. Expected: PASS.
- [ ] **Step 8: Page** `src/app/scorecard-preview/page.tsx`:
```tsx
import Link from "next/link";
import { ScorecardForm } from "@/components/scorecard/ScorecardForm";
import { Section } from "@/components/Section";
import { Wordmark } from "@/components/Wordmark";
import { scorecard } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

// Standalone lead-magnet page: no site nav, so nothing competes with the form.
export const metadata = pageMetadata({ ...scorecard.page.meta, path: "/scorecard-preview" });

export default function ScorecardPreviewPage() {
  return (
    <main>
      <Section hug gridlines={false} className="bg-neutral-100">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-10">
          <Link href="/" aria-label="Sari Sari Design home" className="w-fit">
            <Wordmark className="text-[22px] text-neutral-1000" />
          </Link>
          <ScorecardForm />
        </div>
      </Section>
    </main>
  );
}
```
Note: the layout's title template adds the site suffix, so set `scorecard.page.meta.title` to `"Free Activation Scorecard"` in Step 1's content. That avoids a doubled "| Sari Sari Design".
- [ ] **Step 9:** `npm run typecheck && npm test`. Expected: PASS.
- [ ] **Step 10: Commit** `git add src/content/site.ts src/app/globals.css src/components/scorecard src/app/scorecard-preview && git commit -m "Add /scorecard-preview page with the free Activation Scorecard form"`

### Task 5: Point site CTAs at the new page + e2e

**Files:**
- Modify: `src/content/site.ts:16-17`, `e2e/home.spec.ts:36-39`, `e2e/pages.spec.ts`

- [ ] **Step 1: Failing e2e.** In `e2e/home.spec.ts`, change the href expectation to `"/scorecard-preview"`. Append to `e2e/pages.spec.ts`:
```ts
test.describe("/scorecard-preview", () => {
  test("renders the standalone scorecard form", async ({ page }) => {
    await page.goto("/scorecard-preview");
    await expect(page.getByRole("heading", { name: /top 5 points keeping your users/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /get your free activation scorecard/i })).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(0);
  });

  test("is accessible", async ({ page }) => {
    await page.goto("/scorecard-preview");
    await expectNoSeriousA11yViolations(page);
  });
});
```
- [ ] **Step 2:** `npx playwright test e2e/home.spec.ts e2e/pages.spec.ts`. Expected: the home pricing-link test FAILS (still the subdomain).
- [ ] **Step 3:** In `src/content/site.ts`:
```ts
/** Free activation scorecard (lead magnet). Standalone page; backend in /api/scorecard-request. */
export const SCORECARD_URL = "/scorecard-preview";
```
- [ ] **Step 4:** `npx playwright test`. Expected: all PASS. Fix any serious axe violations on the new page in `ScorecardForm.tsx` (e.g. contrast on `text-neutral-500` placeholder).
- [ ] **Step 5: Commit** `git add src/content/site.ts e2e && git commit -m "Point Get free Scorecard CTAs at /scorecard-preview"`

### Task 6: Full verification + visual parity

- [ ] **Step 1:** `npm run typecheck && npm test && npm run build && npm run test:e2e`. All must pass.
- [ ] **Step 2:** `npm run dev`. Screenshot `http://localhost:3000/scorecard-preview` (desktop 1440 and mobile 390) to `.context/scorecard-preview-{desktop,mobile}.png`, and the live `https://activation-diagnostic.sarisari.design/preview/` to `.context/scorecard-live-desktop.png`. Compare layout, cover, heading scale and form. Adjust token mapping only if something is clearly off.
- [ ] **Step 3:** Update `content/copy-deck.md` and `PRODUCT.md` lines that say the scorecard lives on the subdomain, so they point to `/scorecard-preview`. Commit.
