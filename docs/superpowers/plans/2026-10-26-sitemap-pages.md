# Sitemap Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> On approval, copy this file to `docs/superpowers/plans/2026-10-26-sitemap-pages.md` and commit it as the first commit.

**Goal:** Turn the one-page sarisari.design site into the proposed sitemap. Work, Services (with Retainers and Activation Diagnostic pages) and Contact (Calendly plus a Say Hello form that writes to Attio) become real routes, and the homepage gains Process and UVP sections.

**Architecture:** Next.js 15 App Router, statically rendered. All copy stays in typed content modules (`src/content/site.ts`, `src/content/case-studies/*.ts`). There is no CMS. A `_template.ts` case-study skeleton is kept out of the registry, so it never publishes. Homepage-only components (`SectionHeader`, `CaseStudyCard`, `RetainerPanel`, offer cards) move to `src/components/` so the new routes can reuse them. The contact form posts to one route handler (`/api/contact`), which upserts a Person in Attio and attaches the message as a Note.

**Tech Stack:** Next.js 15, React 19, Tailwind v4 (DS tokens in `globals.css`), Vitest + Testing Library (jsdom), Playwright + axe.

## Global Constraints
- Node >= 22.14. No new runtime dependencies.
- All visible copy lives in `src/content/*`. Drafted or placeholder copy gets a `// ⚠️` comment (repo convention).
- Use the existing DS classes only (`font-brand`, `text-display-s`, `ds-label`, `text-body-m`, `bg-neutral-*`, `text-primary-*`, etc.). Match the surrounding comment density.
- Nav: Home · Work · Services · Process (`/#process`) · About (`/#about`) · CTA "Book a Call" → `BOOKING_URL` (external).
- Case studies show as unlinked "coming soon" cards until `status: "published"`. Nervana is not added. Genwell is renamed to **Disco** (slug `disco`).
- Retainers: Scale = the existing $16,000/month retainer. Grow = ⚠️ placeholder.
- Activation Build is not shown anywhere on the Services pages.
- The homepage keeps its current section order: Process goes after Services, UVP after Case Studies, and Pricing stays.
- Attio key env var: `ATTIO_API_KEY`. Never log it or expose it to the client.
- Commit after every task. Ship as stacked PRs: **PR1** = Tasks 1–2, **PR2** = Tasks 3–4, **PR3** = Task 5, **PR4** = Tasks 6–8.
- Verify each task with `npm run typecheck && npm test`. Before opening each PR, also run `npm run build && npm run test:e2e`.

---

## File map
| File | Responsibility |
|---|---|
| `src/lib/links.ts` (new) | `isExternal(href)` helper, shared by every page |
| `src/components/SectionHeader.tsx` (new, moved) | Eyebrow + h2 + intro device |
| `src/components/PageHeader.tsx` (new) | h1 + intro for sub-pages |
| `src/components/CaseStudyCard.tsx` (new, moved) | Photo-link card; unlinked when coming soon |
| `src/components/RetainerPanel.tsx` (new, moved + generalised) | A retainer tier's price + feature list |
| `src/components/OfferCards.tsx` (new, moved) | Grid of smaller offers |
| `src/components/ContactForm.tsx` (new) | Client form → `/api/contact` |
| `src/lib/contact.ts` (new) | Validates the contact payload |
| `src/lib/attio.ts` (new) | Attio upsert-person + note |
| `src/app/api/contact/route.ts` (new) | POST handler |
| `src/app/work/page.tsx`, `src/app/services/**/page.tsx`, `src/app/contact/page.tsx` (new) | Routes |
| `src/content/case-studies/_template.ts`, `disco.ts`, `lendzi.ts`, `nutrisnap.ts` (new) | Case study data |
| `src/content/site.ts` (modify) | Nav + new page copy |
| `src/app/page.tsx` (modify) | Homepage uses the moved components; adds Process + Why |
| `e2e/home.spec.ts` (modify), `e2e/pages.spec.ts` (new) | Browser tests |

---

## PR 1 — Nav + homepage

### Task 1: Extract shared components out of the homepage (no behaviour change)

**Files:**
- Create: `src/lib/links.ts`, `src/components/SectionHeader.tsx`, `src/components/CaseStudyCard.tsx`, `src/components/RetainerPanel.tsx`, `src/components/OfferCards.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/CaseStudyCard.test.tsx`

**Interfaces:**
- Produces:
  - `isExternal(href: string): boolean`
  - `SectionHeader({ eyebrow?, headline, intro?, headingId? })`
  - `CaseStudyCard({ c: CaseStudy, featured: boolean })`
  - `RetainerPanel({ retainer: Retainer })` where `type Retainer = { name?: string; price: string; period: string; description: string; cta: { label: string; href: string }; features: { title: string; body?: string }[] }` is exported from `RetainerPanel.tsx`
  - `OfferCards({ offers: Offer[] })` where `type Offer = { name: string; price: string; body: string; cta: { label: string; href: string } }` is exported from `OfferCards.tsx`

- [ ] **Step 1: Write the failing test** — `src/components/CaseStudyCard.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CaseStudy } from "@/content/case-studies";
import { CaseStudyCard } from "./CaseStudyCard";

const base: CaseStudy = {
  slug: "acme",
  status: "coming-soon",
  client: "Acme",
  card: { productType: null, helpedWith: [], outcome: null, image: null },
};

describe("CaseStudyCard", () => {
  it("links a published study to its page", () => {
    render(<CaseStudyCard c={{ ...base, status: "published" }} featured={false} />);
    expect(screen.getByRole("link", { name: "Acme case study" })).toHaveAttribute("href", "/work/acme");
  });

  it("renders a coming-soon study without a link", () => {
    render(<CaseStudyCard c={base} featured={false} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Case study coming soon.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `npx vitest run src/components/CaseStudyCard.test.tsx`. Expected: FAIL, cannot resolve `./CaseStudyCard`.

- [ ] **Step 3: Create `src/lib/links.ts`**

```ts
/** Offsite hrefs open in a new tab (Calendly, the diagnostic app). */
export const isExternal = (href: string) => /^https?:\/\//.test(href);
```

- [ ] **Step 4: Move the components.** Cut these out of `src/app/page.tsx` into their own files, adding `import`s at the top and `export` on each function:
  - `SectionHeader` (lines 50–74) → `src/components/SectionHeader.tsx`. Imports `Eyebrow` from `./Eyebrow` and `Reveal` from `./Reveal`.
  - `CaseStudyCard` (lines 179–235, including its doc comment) → `src/components/CaseStudyCard.tsx`. Imports `Link` from `next/link`, `Placeholder` from `./Placeholder`, and `type CaseStudy, caseStudyHref` from `@/content/case-studies`.
  - `RetainerPanel` + `FeatureRow` (lines 310–350) → `src/components/RetainerPanel.tsx`, generalised to take a prop:

```tsx
import { Button } from "./Button";

export type Retainer = {
  /** Tier name shown above the price (e.g. "Grow"); omitted on the homepage. */
  name?: string;
  price: string;
  period: string;
  description: string;
  cta: { label: string; href: string };
  features: { title: string; body?: string }[];
};

/** A retainer offer: price, pitch, and its numbered feature list. */
export function RetainerPanel({ retainer: r }: { retainer: Retainer }) {
  return (
    <div className="grid gap-12 rounded-2xl border border-neutral-300 bg-white p-8 md:grid-cols-2 md:p-12">
      <div className="flex flex-col gap-6">
        {r.name && <span className="ds-label text-label-m text-neutral-700">{r.name}</span>}
        <div className="flex items-baseline gap-2">
          <span className="font-brand text-display-m italic leading-none text-neutral-1000">
            {r.price}
          </span>
          <span className="text-title-l text-neutral-700">{r.period}</span>
        </div>
        <p className="text-body-m text-neutral-700">{r.description}</p>
        <div>
          <Button href={r.cta.href} external>
            {r.cta.label}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {r.features.map((f, i) => (
          <FeatureRow key={f.title} n={String(i + 1).padStart(2, "0")} title={f.title} body={f.body} />
        ))}
      </div>
    </div>
  );
}

function FeatureRow({ n, title, body }: { n: string; title: string; body?: string }) {
  return (
    <div className="flex gap-4 border-b border-neutral-400 pb-6 last:border-b-0 last:pb-0">
      <span className="ds-label flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-400 text-label-s text-neutral-700">
        {n}
      </span>
      <div className="flex flex-col gap-1">
        <h4 className="text-title-m font-medium leading-6 text-neutral-1000">{title}</h4>
        {body && <p className="text-body-s text-neutral-700">{body}</p>}
      </div>
    </div>
  );
}
```

  - The offer `<ul>` (lines 286–304) → `src/components/OfferCards.tsx`:

```tsx
import { isExternal } from "@/lib/links";
import { Button } from "./Button";

export type Offer = { name: string; price: string; body: string; cta: { label: string; href: string } };

/** Lighter offer cards (Audit, Diagnostic, …) that sit under a retainer. */
export function OfferCards({ offers }: { offers: Offer[] }) {
  return (
    <ul className={`grid gap-4 ${offers.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {offers.map((o) => (
        <li key={o.name} className="flex flex-col gap-4 rounded-lg border border-neutral-300 bg-white p-8">
          <span className="ds-label text-label-s text-neutral-700">{o.name}</span>
          <span className="font-brand text-h1 italic leading-none text-neutral-1000">{o.price}</span>
          <p className="flex-1 text-body-s text-neutral-700">{o.body}</p>
          <div>
            <Button href={o.cta.href} variant="ghost" external={isExternal(o.cta.href)}>
              {o.cta.label}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Rewire `src/app/page.tsx`.**
  - Delete the local `isExternal` and import it from `@/lib/links`.
  - Import `SectionHeader`, `CaseStudyCard`, `RetainerPanel` and `OfferCards`.
  - Remove the now-unused `Link` and `Placeholder` imports.
  - In `Pricing`, use `<RetainerPanel retainer={pricing.retainer} />`, and replace the `<ul>` with `<OfferCards offers={pricing.offers} />`.

- [ ] **Step 6: Run the checks.** Run `npm run typecheck && npm test`. Expected: PASS, including both new CaseStudyCard tests.

- [ ] **Step 7: Commit**

```bash
git add src/lib src/components src/app/page.tsx
git commit -m "Extract shared section, case-card, retainer and offer components"
```

### Task 2: New nav + homepage Process and UVP sections

**Files:**
- Modify: `src/content/site.ts` (`nav`, `services`, `caseStudiesSection`)
- Modify: `src/app/page.tsx`
- Modify: `e2e/home.spec.ts`
- Test: `src/content/site.test.ts`

**Interfaces:**
- Consumes: `SectionHeader` (Task 1)
- Produces: homepage anchors `#process` and `#uvp`. `services.seeAll` and `caseStudiesSection.seeAll`, both `{ label: string; href: string }`.

- [ ] **Step 1: Write the failing test** — `src/content/site.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { BOOKING_URL, nav } from "./site";

describe("nav", () => {
  it("follows the sitemap order", () => {
    expect(nav.links.map((l) => [l.label, l.href])).toEqual([
      ["Home", "/"],
      ["Work", "/work"],
      ["Services", "/services"],
      ["Process", "/#process"],
      ["About", "/#about"],
    ]);
    expect(nav.cta.href).toBe(BOOKING_URL);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `npx vitest run src/content/site.test.ts`. Expected: FAIL (the labels differ).

- [ ] **Step 3: Update content in `src/content/site.ts`**

```ts
export const nav = {
  links: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/#about" },
  ],
  cta: { label: "Book a Call", href: BOOKING_URL },
};
```

Add `seeAll: { label: "See all services", href: "/services" },` to `services`, and `seeAll: { label: "See all work", href: "/work" },` to `caseStudiesSection`.

- [ ] **Step 4: Add the sections in `src/app/page.tsx`**
  - Render order: `<Hero /> <Regulars /> <Services /> <Process /> <CaseStudies /> <Why /> <Pricing /> <About /> <Testimonials /> <Faq />`.
  - In `Services`, add a link below the list: `<Reveal className="mt-10"><Button href={services.seeAll.href} variant="ghost">{services.seeAll.label}</Button></Reveal>`.
  - In `CaseStudies`, render `caseStudies.slice(0, 3)` and add the same ghost button for `caseStudiesSection.seeAll`.
  - In `Faq`, drop the spread of `why.items` and its comment. The comparisons now have their own section, so `items = faq.items.map((f) => ({ label: f.q, body: f.a }))`.
  - Add `process` to the `@/content/site` import. Then add:

```tsx
/** How we work: four phases of the double diamond, each with its timing. */
function Process() {
  return (
    <Section id="process" aria-labelledby="process-h" className="bg-neutral-100">
      <SectionHeader
        headingId="process-h"
        eyebrow={process.eyebrow}
        headline={process.headline}
        intro={process.intro}
      />
      <Reveal className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((s) => (
          <div key={s.n} className="flex flex-col gap-3 border-t border-neutral-400 pt-6">
            <span className="ds-label text-label-s text-neutral-700">
              {s.n} · {s.when}
            </span>
            <h3 className="font-brand text-h2 leading-[1.1] text-neutral-1000">{s.title}</h3>
            <p className="text-body-s text-neutral-700">{s.body}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

/** Why Sari Sari: the four alternatives a buyer is weighing us against. */
function Why() {
  return (
    <Section id="uvp" aria-labelledby="uvp-h" className="bg-neutral-200">
      <SectionHeader headingId="uvp-h" eyebrow={why.eyebrow} headline={why.headline} />
      <Reveal className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {why.items.map((w) => (
          <div key={w.title} className="flex flex-col gap-3">
            <h3 className="text-title-l font-medium text-neutral-1000">{w.title}</h3>
            <p className="text-body-m text-neutral-700">{w.body}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
```

> If `text-h2` isn't defined in `globals.css` (check with `grep -n "\-\-text-h2" src/app/globals.css`), use `text-h1` instead.

- [ ] **Step 5: Update `e2e/home.spec.ts`.** The anchor id list becomes `["regulars", "services", "process", "work", "uvp", "pricing", "about", "testimonials", "faq"]`.

- [ ] **Step 6: Run the checks.** Run `npm run typecheck && npm test && npm run build && npm run test:e2e`. Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/site.ts src/content/site.test.ts src/app/page.tsx e2e/home.spec.ts
git commit -m "Sitemap nav; homepage Process and Why sections; teaser links"
```

---

## PR 2 — Work

### Task 3: Case study template, Disco rename, Lendzi + NutriSnap

**Files:**
- Create: `src/content/case-studies/_template.ts`, `disco.ts`, `lendzi.ts`, `nutrisnap.ts`
- Delete: `src/content/case-studies/genwell.ts`
- Modify: `src/content/case-studies/index.ts`, `funding-solutions.ts`
- Test: `src/content/case-studies/index.test.ts`

**Interfaces:**
- Consumes: `CaseStudy` from `./types`
- Produces: `caseStudyTemplate: CaseStudy` (unregistered). `caseStudies` order: kenchan-ramen, funding-solutions, lendzi, disco, nutrisnap.

- [ ] **Step 1: Write the failing test** — `src/content/case-studies/index.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { caseStudyTemplate } from "./_template";
import { caseStudies, publishedCaseStudies } from "./index";

describe("case study registry", () => {
  it("lists the sitemap's studies in order", () => {
    expect(caseStudies.map((c) => c.slug)).toEqual([
      "kenchan-ramen",
      "funding-solutions",
      "lendzi",
      "disco",
      "nutrisnap",
    ]);
  });

  it("never registers the template", () => {
    expect(caseStudies).not.toContain(caseStudyTemplate);
    expect(caseStudies.map((c) => c.slug)).not.toContain(caseStudyTemplate.slug);
  });

  it("gives every published study a page", () => {
    for (const c of publishedCaseStudies) expect(c.page, c.slug).toBeDefined();
  });

  it("has unique slugs", () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `npx vitest run src/content/case-studies/index.test.ts`. Expected: FAIL, cannot resolve `./_template`.

- [ ] **Step 3: Create `src/content/case-studies/_template.ts`**

```ts
import type { CaseStudy } from "./types";

/**
 * Case-study template, modelled on `kenchan-ramen.ts`. NOT registered in `index.ts`, so it
 * never publishes. To add a study:
 *   1. Copy this file to `<slug>.ts`, rename the export, set `slug` + `client`.
 *   2. Fill `card` (shows on /work and the homepage straight away as "coming soon").
 *   3. Fill `page`: hero stats, intro, then blocks in Kenchan's rhythm
 *      (section → figure → stats → steps → quote → section → split → big stats).
 *   4. Add it to the list in `index.ts`.
 *   5. When the copy and images are final, set `status: "published"` — that creates /work/<slug>.
 * Images go in `public/work/<slug>-*.webp`.
 */
export const caseStudyTemplate: CaseStudy = {
  slug: "template",
  status: "coming-soon",
  client: "Client name",
  card: {
    productType: null, // e.g. "Ecommerce", "Fintech"
    helpedWith: [], // e.g. ["Product strategy", "Conversion"]
    outcome: null, // one line with the number, e.g. "A bundle test now drives 37% of revenue."
    image: null, // "/work/<slug>.webp"
  },
  page: {
    title: "Headline that names the result",
    byline: "Client: Name · Partner: Name",
    tags: ["Strategy", "Product Design"],
    heroImage: null, // "/work/<slug>-hero.webp"
    heroStats: [
      { value: "00%", label: "headline metric" },
      { value: "+0%", label: "second metric" },
      { value: "0 wks", label: "time to result" },
    ],
    intro: "Who the client is, what they came to us for, and what it turned into.",
    blocks: [
      { kind: "section", label: "Inquiry", title: "What the client asked for.", paragraphs: ["Context."] },
      { kind: "section", title: "The tension or insight.", paragraphs: ["Why the obvious path was wrong."] },
      { kind: "section", title: "How we reframed the project.", paragraphs: ["The new objective."] },
      { kind: "figure", ratio: "774x516", caption: "Fig 01 — caption" },
      { kind: "stats", stats: [{ value: "00%", label: "early signal" }] },
      { kind: "step", title: "1. First move.", paragraphs: ["What we did and why."] },
      { kind: "step", title: "2. Second move.", paragraphs: ["What we did and why."] },
      { kind: "quote", quote: "Client quote.", name: "Name", role: "Role, Company" },
      { kind: "split", title: "From test to lasting result.", paragraphs: ["The outcome.", "Why it worked."] },
      { kind: "stats", big: true, stats: [{ value: "00%", label: "final metric" }] },
    ],
  },
};
```

- [ ] **Step 4: Apply the template to the four studies.** Each file below is a copy of `_template.ts` with its header changed. Its `page` is the template's `page` object copied verbatim, with every string prefixed `⚠️ `. Status stays `"coming-soon"`.
  - `funding-solutions.ts`: keep the existing `card`. Header comment: `/** ⚠️ Drafted from _template.ts — fill \`page\` from the Figma version, then set status "published". */`. Add `page` as above.
  - `disco.ts` (replaces `genwell.ts`; run `git rm src/content/case-studies/genwell.ts`):

```ts
import type { CaseStudy } from "./types";

/** ⚠️ Drafted from _template.ts (formerly "GenWell") — fill `page`, then set status "published". */
export const disco: CaseStudy = {
  slug: "disco",
  status: "coming-soon",
  client: "Disco",
  card: {
    productType: null, // ⚠️ product type
    helpedWith: [],
    outcome: null,
    image: null, // ⚠️ unbranded image pending
  },
  page: { /* ⚠️-prefixed copy of _template.ts `page` */ },
};
```

  - `lendzi.ts`: export `lendzi`, slug `lendzi`, client `"Lendzi"`, `productType: "Fintech"`, `image: null` (only a logo exists in `public/logos/lendzi.png`), plus `page` as above.
  - `nutrisnap.ts`: export `nutrisnap`, slug `nutrisnap`, client `"NutriSnap"`, `productType: null // ⚠️`, `image: "/work/nutrisnap.webp"`, plus `page` as above.

  > Write the copied `page` literal in full in each file, not as a spread of the template. Each study then owns its copy and can be edited in place.

- [ ] **Step 5: Update `index.ts`**

```ts
import { disco } from "./disco";
import { fundingSolutions } from "./funding-solutions";
import { kenchanRamen } from "./kenchan-ramen";
import { lendzi } from "./lendzi";
import { nutrisnap } from "./nutrisnap";
import type { CaseStudy } from "./types";

export type { CaseStudy, CaseStudyBlock } from "./types";

/**
 * Case studies in display order. To add one, follow the steps in `_template.ts`
 * (which is deliberately not in this list).
 */
export const caseStudies: CaseStudy[] = [kenchanRamen, fundingSolutions, lendzi, disco, nutrisnap];
```

Keep `publishedCaseStudies`, `getCaseStudy` and `caseStudyHref` unchanged.

- [ ] **Step 6: Clean up references.** Run `grep -rni genwell src content docs`. Update any remaining mentions (e.g. `content/copy-deck.md`) to Disco.

- [ ] **Step 7: Run the checks.** Run `npm run typecheck && npm test`. Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A src/content/case-studies content docs
git commit -m "Case study template; rename GenWell to Disco; add Lendzi and NutriSnap drafts"
```

### Task 4: `/work` index page

**Files:**
- Create: `src/components/PageHeader.tsx`, `src/app/work/page.tsx`
- Modify: `src/content/site.ts` (add `workIndex`)
- Test: `e2e/pages.spec.ts` (new)

**Interfaces:**
- Consumes: `CaseStudyCard`, `caseStudies`
- Produces: `PageHeader({ eyebrow?: string; title: string; intro?: string })`, the reusable h1 block for every new route

- [ ] **Step 1: Write the failing e2e** — `e2e/pages.spec.ts`

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoSeriousA11yViolations(page: import("@playwright/test").Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const serious = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test.describe("/work", () => {
  test("lists every study; only published ones link", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const client of ["Kenchan Ramen", "Funding Solutions", "Lendzi", "Disco", "NutriSnap"]) {
      await expect(page.getByRole("heading", { level: 2, name: client })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /kenchan ramen case study/i })).toHaveAttribute(
      "href",
      "/work/kenchan-ramen",
    );
    await expect(page.getByRole("link", { name: /disco case study/i })).toHaveCount(0);
  });

  test("the template and drafts have no page", async ({ page }) => {
    for (const slug of ["template", "disco", "lendzi"]) {
      const res = await page.goto(`/work/${slug}`);
      expect(res?.status()).toBe(404);
    }
  });

  test("is accessible", async ({ page }) => {
    await page.goto("/work");
    await expectNoSeriousA11yViolations(page);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `npx playwright test e2e/pages.spec.ts`. Expected: FAIL (404 on `/work`).

- [ ] **Step 3: Update `CaseStudyCard`.** Add an optional `headingLevel?: "h2" | "h3"` prop (default `"h3"`) and render the client name as `const H = headingLevel;` … `<H …>`. On `/work` the cards sit directly under the h1, so they use h2.

- [ ] **Step 4: Add content to `src/content/site.ts`**

```ts
/** /work index copy. */
export const workIndex = {
  eyebrow: "Work",
  title: "Product design that moved a number.", // ⚠️ drafted
  intro: "Every study names the metric we were hired to move and what happened to it.", // ⚠️ drafted
};
```

- [ ] **Step 5: Create `src/components/PageHeader.tsx`**

```tsx
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Sub-page opener: eyebrow + serif h1 + intro, on the 1200px measure. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <Reveal className="flex max-w-[820px] flex-col gap-6">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-balance font-brand text-[clamp(40px,5vw,72px)] leading-[1.05] tracking-[-0.014em] text-neutral-1000">
        {title}
      </h1>
      {intro && <p className="text-body-l text-neutral-700">{intro}</p>}
    </Reveal>
  );
}
```

- [ ] **Step 6: Create `src/app/work/page.tsx`**

```tsx
import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { caseStudies } from "@/content/case-studies";
import { workIndex } from "@/content/site";

export const metadata: Metadata = {
  title: "Work — Sari Sari Design",
  description: workIndex.intro,
};

/** Case study index: every registered study; coming-soon ones render unlinked. */
export default function WorkIndex() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-100">
          <PageHeader eyebrow={workIndex.eyebrow} title={workIndex.title} intro={workIndex.intro} />
          <Reveal className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {caseStudies.map((c, i) => (
              <CaseStudyCard key={c.slug} c={c} featured={i === 0} headingLevel="h2" />
            ))}
          </Reveal>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
```

- [ ] **Step 7: Run the checks.** Run `npm run typecheck && npm test && npm run build && npx playwright test`. Expected: PASS. The build output lists `/work` and `/work/kenchan-ramen` only.

- [ ] **Step 8: Commit**

```bash
git add src/components/PageHeader.tsx src/components/CaseStudyCard.tsx src/app/work/page.tsx src/content/site.ts e2e/pages.spec.ts
git commit -m "Add /work case study index"
```

---

## PR 3 — Services

### Task 5: `/services`, `/services/retainers`, `/services/activation-diagnostic`

**Files:**
- Create: `src/app/services/page.tsx`, `src/app/services/retainers/page.tsx`, `src/app/services/activation-diagnostic/page.tsx`
- Modify: `src/content/site.ts` (add `servicesPage`, `retainers`, `diagnostic`)
- Test: `src/content/site.test.ts` (extend), `e2e/pages.spec.ts` (extend)

**Interfaces:**
- Consumes: `PageHeader`, `SectionHeader`, `ServicesList`, `RetainerPanel` + `Retainer`, `OfferCards` + `Offer`, `Accordion`, `faq`, `pricing`
- Produces: `servicesPage.faqItems(): {label: string; body: string}[]`

- [ ] **Step 1: Write the failing unit tests.** Append to `src/content/site.test.ts`:

```ts
import { diagnostic, faq, retainers, servicesPage } from "./site";

describe("services content", () => {
  it("pulls its FAQ subset from the main FAQ", () => {
    const qs = faq.items.map((f) => f.q);
    for (const item of servicesPage.faqItems()) expect(qs).toContain(item.label);
    expect(servicesPage.faqItems().length).toBeGreaterThan(0);
  });

  it("offers Grow and Scale retainers, Scale at the current price", () => {
    expect(retainers.tiers.map((t) => t.name)).toEqual(["Grow", "Scale"]);
    expect(retainers.tiers[1].price).toBe("$16,000");
  });

  it("shows Audit and Diagnostic but not Build", () => {
    expect(diagnostic.tiers.map((t) => t.name)).toEqual(["Audit", "Diagnostic"]);
  });
});
```

(Merge the import into the existing one at the top of the file.)

- [ ] **Step 2: Run it and confirm it fails.** Run `npx vitest run src/content/site.test.ts`. Expected: FAIL, missing exports.

- [ ] **Step 3: Add content to `src/content/site.ts`** (after `faq`, so it can reference it):

```ts
/** /services overview: services list, two offer cards, a pricing summary, and an FAQ subset. */
export const servicesPage = {
  eyebrow: "Services",
  title: services.headline,
  intro: services.intro,
  offersHeading: "Two ways to work with us",
  offers: [
    {
      name: "Retainers",
      price: "From ⚠️ $X,000/mo", // ⚠️ set once Grow is priced
      body: "An embedded senior product team. Grow while you find fit; Scale when you're ready to move fast.",
      cta: { label: "Compare retainers", href: "/services/retainers" },
    },
    {
      name: "Activation Diagnostic",
      price: "From $1,500",
      body: "Find where customers leak, then get the redesigned fix. Start with a free scorecard.",
      cta: { label: "See the diagnostic", href: "/services/activation-diagnostic" },
    },
  ],
  faqHeading: "Questions about working with us",
  faqQuestions: [
    "How soon can you start?",
    "What if it isn't working?",
    "Can we pause the retainer?",
    "What do we need ready before starting?",
  ],
  faqItems() {
    return faq.items
      .filter((f) => this.faqQuestions.includes(f.q))
      .map((f) => ({ label: f.q, body: f.a }));
  },
};

/** /services/retainers: Grow vs Scale. Scale is the existing retainer. */
export const retainers = {
  eyebrow: "Retainers",
  title: "Grow vs. Scale",
  intro: "Same senior team, same rituals. The difference is how much we take on each month.", // ⚠️ drafted
  tiers: [
    {
      name: "Grow",
      price: "⚠️ $X,000", // ⚠️ price pending
      period: "/ month",
      description: "⚠️ For teams finding fit: one focus area at a time, design-led.", // ⚠️ drafted
      cta: { label: "Book an intro call", href: BOOKING_URL },
      features: [
        { title: "⚠️ Feature one" },
        { title: "⚠️ Feature two" },
        { title: "⚠️ Feature three" },
      ],
    },
    { name: "Scale", ...pricing.retainer },
  ],
};

/** /services/activation-diagnostic: overview that sends people to the diagnostic app. */
export const diagnostic = {
  eyebrow: "Activation Diagnostic",
  title: "Find the leak. Get the fix.",
  intro:
    "Most products lose people between sign-up and the first moment of value. We find exactly where, and redesign it.", // ⚠️ drafted
  tiers: pricing.offers.filter((o) => o.name !== "Build"),
  cta: { label: "Open the diagnostic", href: DIAGNOSTIC_URL },
};
```

> `retainers` and `diagnostic` read `pricing`, so place them after `pricing` (line ~294+). Keep `servicesPage` after both `faq` and `services`.

- [ ] **Step 4: Create `src/app/services/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { OfferCards } from "@/components/OfferCards";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesList } from "@/components/ServicesList";
import { services, servicesPage } from "@/content/site";

export const metadata: Metadata = {
  title: "Services — Sari Sari Design",
  description: servicesPage.intro,
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-200">
          <PageHeader eyebrow={servicesPage.eyebrow} title={servicesPage.title} intro={servicesPage.intro} />
          <Reveal>
            <ServicesList items={services.cards} />
          </Reveal>
        </Section>
        <Section aria-labelledby="offers-h" className="bg-neutral-100">
          <SectionHeader headingId="offers-h" headline={servicesPage.offersHeading} />
          <Reveal className="mt-12">
            <OfferCards offers={servicesPage.offers} />
          </Reveal>
        </Section>
        <Section aria-labelledby="services-faq-h" className="bg-neutral-200">
          <SectionHeader headingId="services-faq-h" headline={servicesPage.faqHeading} />
          <Reveal className="mt-12 max-w-[820px]">
            <Accordion items={servicesPage.faqItems()} defaultOpen={0} />
          </Reveal>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
```

> `ServicesList` renders each row title as an `<h3>`. Under the page `<h1>` that skips h2. If axe flags heading order, add a visually hidden `<h2 className="sr-only">What we do</h2>` above the list.

- [ ] **Step 5: Create `src/app/services/retainers/page.tsx`**

```tsx
import type { Metadata } from "next";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { RetainerPanel } from "@/components/RetainerPanel";
import { Section } from "@/components/Section";
import { retainers } from "@/content/site";

export const metadata: Metadata = {
  title: "Retainers — Sari Sari Design",
  description: retainers.intro,
};

/** Grow vs Scale, one RetainerPanel per tier. */
export default function RetainersPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-200">
          <PageHeader eyebrow={retainers.eyebrow} title={retainers.title} intro={retainers.intro} />
          <div className="mt-16 flex flex-col gap-8">
            {retainers.tiers.map((t) => (
              <Reveal key={t.name}>
                <RetainerPanel retainer={t} />
              </Reveal>
            ))}
          </div>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
```

- [ ] **Step 6: Create `src/app/services/activation-diagnostic/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { OfferCards } from "@/components/OfferCards";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { diagnostic } from "@/content/site";

export const metadata: Metadata = {
  title: "Activation Diagnostic — Sari Sari Design",
  description: diagnostic.intro,
};

/** Overview of the diagnostic ladder (free scorecard → Audit → Diagnostic); buying happens in the app. */
export default function ActivationDiagnosticPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-200">
          <PageHeader eyebrow={diagnostic.eyebrow} title={diagnostic.title} intro={diagnostic.intro} />
          <Reveal className="mt-8">
            <Button href={diagnostic.cta.href} external>
              {diagnostic.cta.label}
            </Button>
          </Reveal>
          <Reveal className="mt-16">
            <OfferCards offers={diagnostic.tiers} />
          </Reveal>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
```

- [ ] **Step 7: Extend `e2e/pages.spec.ts`**

```ts
test.describe("/services", () => {
  test("overview links to both offer pages", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByRole("link", { name: /compare retainers/i })).toHaveAttribute("href", "/services/retainers");
    await expect(page.getByRole("link", { name: /see the diagnostic/i })).toHaveAttribute(
      "href",
      "/services/activation-diagnostic",
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("retainers shows Grow and Scale", async ({ page }) => {
    await page.goto("/services/retainers");
    await expect(page.getByText("Grow", { exact: true })).toBeVisible();
    await expect(page.getByText("$16,000")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("diagnostic shows Audit + Diagnostic, links to the app, and hides Build", async ({ page }) => {
    await page.goto("/services/activation-diagnostic");
    await expect(page.getByText("$1,500")).toBeVisible();
    await expect(page.getByText("$6,000")).toBeVisible();
    await expect(page.getByText("Let's talk")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /open the diagnostic/i })).toHaveAttribute(
      "href",
      /activation-diagnostic\.sarisari\.design/,
    );
    await expectNoSeriousA11yViolations(page);
  });
});
```

- [ ] **Step 8: Run the checks.** Run `npm run typecheck && npm test && npm run build && npx playwright test`. Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/app/services src/content/site.ts src/content/site.test.ts e2e/pages.spec.ts
git commit -m "Add /services overview, retainers and activation diagnostic pages"
```

---

## PR 4 — Contact + Attio

### Task 6: Contact validation + Attio client + `/api/contact`

**Files:**
- Create: `src/lib/contact.ts`, `src/lib/attio.ts`, `src/app/api/contact/route.ts`
- Test: `src/lib/contact.test.ts`, `src/app/api/contact/route.test.ts`

**Interfaces:**
- Produces:
  - `type ContactInput = { name: string; email: string; company: string; message: string }`
  - `parseContact(body: unknown): { ok: true; data: ContactInput } | { ok: false; error: string } | { ok: "spam" }`
  - `createAttioLead(input: ContactInput, apiKey: string, fetchImpl?: typeof fetch): Promise<void>` (throws on a non-2xx response)
  - `POST /api/contact`: JSON in. Responds `200 {ok:true}`, `400 {error}`, or `500 {error}`.

- [ ] **Step 1: Write the failing validation tests** — `src/lib/contact.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { parseContact } from "./contact";

const good = { name: "Ada Lovelace", email: "ada@example.com", company: "Engines", message: "Hi there" };

describe("parseContact", () => {
  it("accepts a valid submission and trims fields", () => {
    expect(parseContact({ ...good, name: "  Ada Lovelace " })).toEqual({ ok: true, data: good });
  });
  it("allows an empty company", () => {
    expect(parseContact({ ...good, company: "" })).toEqual({ ok: true, data: { ...good, company: "" } });
  });
  it("rejects a bad email", () => {
    expect(parseContact({ ...good, email: "nope" })).toEqual({ ok: false, error: "Enter a valid email." });
  });
  it("rejects a missing name or message", () => {
    expect(parseContact({ ...good, name: "" }).ok).toBe(false);
    expect(parseContact({ ...good, message: " " }).ok).toBe(false);
  });
  it("flags the honeypot as spam", () => {
    expect(parseContact({ ...good, website: "http://spam" })).toEqual({ ok: "spam" });
  });
  it("rejects non-objects", () => {
    expect(parseContact(null).ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `npx vitest run src/lib/contact.test.ts`. Expected: FAIL, cannot resolve module.

- [ ] **Step 3: Implement `src/lib/contact.ts`**

```ts
export type ContactInput = { name: string; email: string; company: string; message: string };

type Parsed = { ok: true; data: ContactInput } | { ok: false; error: string } | { ok: "spam" };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validates the Say Hello form. `website` is a hidden honeypot: bots fill it, people don't. */
export function parseContact(body: unknown): Parsed {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid submission." };
  const b = body as Record<string, unknown>;
  if (str(b.website)) return { ok: "spam" };
  const data = { name: str(b.name), email: str(b.email), company: str(b.company), message: str(b.message) };
  if (!data.name) return { ok: false, error: "Enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, error: "Enter a valid email." };
  if (!data.message) return { ok: false, error: "Add a message." };
  if (data.message.length > 5000) return { ok: false, error: "Message is too long." };
  return { ok: true, data };
}
```

- [ ] **Step 4: Run it and confirm it passes.** Run `npx vitest run src/lib/contact.test.ts`. Expected: PASS.

- [ ] **Step 5: Write the failing route tests** — `src/app/api/contact/route.test.ts`

```ts
// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const good = { name: "Ada Lovelace", email: "ada@example.com", company: "Engines", message: "Hi" };
const post = (body: unknown) =>
  POST(new Request("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body) }));

describe("POST /api/contact", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("ATTIO_API_KEY", "test-key");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock
      .mockResolvedValueOnce(Response.json({ data: { id: { record_id: "rec_1" } } }))
      .mockResolvedValueOnce(Response.json({ data: {} }));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("upserts the person by email, then attaches the message as a note", async () => {
    const res = await post(good);
    expect(res.status).toBe(200);

    const [personUrl, personInit] = fetchMock.mock.calls[0];
    expect(personUrl).toBe("https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses");
    expect(personInit.method).toBe("PUT");
    expect(personInit.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(personInit.body).data.values.email_addresses).toEqual(["ada@example.com"]);

    const [noteUrl, noteInit] = fetchMock.mock.calls[1];
    expect(noteUrl).toBe("https://api.attio.com/v2/notes");
    const note = JSON.parse(noteInit.body).data;
    expect(note).toMatchObject({ parent_object: "people", parent_record_id: "rec_1", format: "plaintext" });
    expect(note.content).toContain("Hi");
    expect(note.content).toContain("Engines");
  });

  it("returns 400 without calling Attio on invalid input", async () => {
    const res = await post({ ...good, email: "bad" });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pretends success for honeypot submissions", async () => {
    const res = await post({ ...good, website: "x" });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 500 when the key is missing", async () => {
    vi.stubEnv("ATTIO_API_KEY", "");
    const res = await post(good);
    expect(res.status).toBe(500);
  });

  it("returns 500 when Attio fails", async () => {
    fetchMock.mockReset().mockResolvedValueOnce(new Response("nope", { status: 401 }));
    const res = await post(good);
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 6: Run it and confirm it fails.** Run `npx vitest run src/app/api/contact/route.test.ts`. Expected: FAIL, cannot resolve `./route`.

- [ ] **Step 7: Implement `src/lib/attio.ts`**

```ts
import type { ContactInput } from "./contact";

const API = "https://api.attio.com/v2";

/**
 * Writes a Say Hello submission to Attio: upserts the Person (matched on email), then
 * attaches the message as a Note on that record. Throws on any non-2xx response.
 */
export async function createAttioLead(input: ContactInput, apiKey: string, fetchImpl: typeof fetch = fetch) {
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const [first, ...rest] = input.name.split(/\s+/);

  const personRes = await fetchImpl(`${API}/objects/people/records?matching_attribute=email_addresses`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      data: {
        values: {
          email_addresses: [input.email],
          name: [{ first_name: first, last_name: rest.join(" "), full_name: input.name }],
        },
      },
    }),
  });
  if (!personRes.ok) throw new Error(`Attio person upsert failed: ${personRes.status}`);
  const recordId: string = (await personRes.json()).data.id.record_id;

  const noteRes = await fetchImpl(`${API}/notes`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: {
        parent_object: "people",
        parent_record_id: recordId,
        title: "Website: Say Hello",
        format: "plaintext",
        content: [input.company && `Company: ${input.company}`, input.message].filter(Boolean).join("\n\n"),
      },
    }),
  });
  if (!noteRes.ok) throw new Error(`Attio note failed: ${noteRes.status}`);
}
```

- [ ] **Step 8: Implement `src/app/api/contact/route.ts`**

```ts
import { createAttioLead } from "@/lib/attio";
import { parseContact } from "@/lib/contact";

/** Say Hello form → Attio. Generic errors only; details go to the server log. */
export async function POST(req: Request) {
  const parsed = parseContact(await req.json().catch(() => null));
  if (parsed.ok === "spam") return Response.json({ ok: true });
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const apiKey = process.env.ATTIO_API_KEY;
  if (!apiKey) {
    console.error("contact: ATTIO_API_KEY is not set");
    return Response.json({ error: "Something went wrong. Email us instead." }, { status: 500 });
  }
  try {
    await createAttioLead(parsed.data, apiKey);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("contact:", err);
    return Response.json({ error: "Something went wrong. Email us instead." }, { status: 500 });
  }
}
```

- [ ] **Step 9: Run the tests and confirm they pass.** Run `npm run typecheck && npm test`. Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/lib/contact.ts src/lib/contact.test.ts src/lib/attio.ts src/app/api/contact
git commit -m "Add /api/contact: validate Say Hello and write lead + note to Attio"
```

### Task 7: ContactForm component + `/contact` page

**Files:**
- Create: `src/components/ContactForm.tsx`, `src/app/contact/page.tsx`
- Modify: `src/content/site.ts` (add `contact`, plus a footer link)
- Test: `src/components/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `POST /api/contact` (Task 6), `BOOKING_URL`, `CONTACT_EMAIL`
- Produces: `ContactForm()` (no props; copy comes from `contact.form`)

- [ ] **Step 1: Write the failing component tests** — `src/components/ContactForm.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

afterEach(() => vi.unstubAllGlobals());

async function fill() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
  await user.type(screen.getByLabelText(/email/i), "ada@example.com");
  await user.type(screen.getByLabelText(/message/i), "Hello");
  await user.click(screen.getByRole("button", { name: /send/i }));
}

describe("ContactForm", () => {
  it("posts the fields and shows the success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    await fill();
    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body)).toMatchObject({ name: "Ada Lovelace", email: "ada@example.com", message: "Hello" });
  });

  it("shows the server error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "Enter a valid email." }, { status: 400 })));
    render(<ContactForm />);
    await fill();
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email.");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails.** Run `npx vitest run src/components/ContactForm.test.tsx`. Expected: FAIL, cannot resolve module.

- [ ] **Step 3: Add content to `src/content/site.ts`**

```ts
/** /contact: Calendly is the primary path; the Say Hello form is the secondary. */
export const contact = {
  eyebrow: "Contact",
  title: "Let's talk about where growth is stalling.",
  intro: "Pick a time below, or send a note if you'd rather start by email.", // ⚠️ drafted
  bookingHeading: "Book a call",
  bookingEmbed: `${BOOKING_URL}?hide_gdpr_banner=1`,
  form: {
    heading: "Say hello",
    fields: { name: "Name", email: "Email", company: "Company (optional)", message: "Message" },
    submit: "Send",
    sending: "Sending…",
    success: "Thanks — we'll reply within one business day.", // ⚠️ confirm SLA
    fallbackError: `Something went wrong. Email us at ${CONTACT_EMAIL}.`,
  },
};
```

Add `{ label: "Contact", href: "/contact" },` as the first entry of `footer.links`.

- [ ] **Step 4: Implement `src/components/ContactForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { contact } from "@/content/site";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const input =
  "w-full rounded-lg border border-neutral-400 bg-white px-4 py-3 text-body-m text-neutral-1000 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300";

/** Say Hello: posts to /api/contact (→ Attio). `website` is a visually hidden honeypot. */
export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const f = contact.form;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "sending" });
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setState({ kind: "sent" });
      else setState({ kind: "error", message: json.error ?? f.fallbackError });
    } catch {
      setState({ kind: "error", message: f.fallbackError });
    }
  }

  if (state.kind === "sent") {
    return (
      <p role="status" className="text-body-l text-neutral-1000">
        {f.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-[640px] flex-col gap-5" noValidate>
      {(["name", "email", "company"] as const).map((k) => (
        <label key={k} className="flex flex-col gap-2">
          <span className="ds-label text-label-s text-neutral-700">{f.fields[k]}</span>
          <input
            name={k}
            type={k === "email" ? "email" : "text"}
            required={k !== "company"}
            autoComplete={k === "company" ? "organization" : k}
            className={input}
          />
        </label>
      ))}
      <label className="flex flex-col gap-2">
        <span className="ds-label text-label-s text-neutral-700">{f.fields.message}</span>
        <textarea name="message" required rows={5} className={input} />
      </label>
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.kind === "error" && (
        <p role="alert" className="text-body-s text-red-600">
          {state.message}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="ds-label rounded-full bg-primary-100 px-8 py-4 text-label-m text-primary-400 hover:bg-primary-200 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
        >
          {state.kind === "sending" ? f.sending : f.submit}
        </button>
      </div>
    </form>
  );
}
```

> The submit button uses the `secondary` Button skin, which the sitemap calls "ghost" (the secondary path). If `text-red-600` isn't a DS token, pick the closest error token from `globals.css`.

- [ ] **Step 5: Run the tests and confirm they pass.** Run `npx vitest run src/components/ContactForm.test.tsx`. Expected: PASS.

- [ ] **Step 6: Create `src/app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { BOOKING_URL, contact } from "@/content/site";

export const metadata: Metadata = { title: "Contact — Sari Sari Design", description: contact.intro };

/** Primary: book a call (Calendly inline). Ghost: Say Hello form → Attio. */
export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <Section aria-labelledby="book-h" className="bg-neutral-100">
          <PageHeader eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro} />
          <div className="mt-16 flex flex-col gap-6">
            <SectionHeader headingId="book-h" headline={contact.bookingHeading} />
            <iframe
              src={contact.bookingEmbed}
              title="Book a call with Sari Sari"
              loading="lazy"
              className="h-[720px] w-full rounded-2xl border border-neutral-300 bg-white"
            />
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-body-s text-primary-400 underline">
              Calendar not loading? Open it in Calendly.
            </a>
          </div>
        </Section>
        <Section aria-labelledby="hello-h" className="bg-neutral-200">
          <SectionHeader headingId="hello-h" headline={contact.form.heading} />
          <div className="mt-10">
            <ContactForm />
          </div>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
```

- [ ] **Step 7: Run the checks.** Run `npm run typecheck && npm test && npm run build`. Expected: PASS. The build lists `/contact` (static) and `/api/contact` (dynamic).

- [ ] **Step 8: Commit**

```bash
git add src/components/ContactForm.tsx src/components/ContactForm.test.tsx src/app/contact src/content/site.ts
git commit -m "Add /contact: Calendly inline booking and Say Hello form"
```

### Task 8: Contact e2e, env docs, cross-route checks

**Files:**
- Modify: `e2e/pages.spec.ts`, `README.md`

- [ ] **Step 1: Extend `e2e/pages.spec.ts`**

```ts
test.describe("/contact", () => {
  test("embeds Calendly and submits the form", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true } }));
    await page.goto("/contact");
    await expect(page.locator('iframe[title="Book a call with Sari Sari"]')).toHaveAttribute("src", /calendly\.com/);
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Hello");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("status")).toContainText(/thanks/i);
  });

  test("is accessible", async ({ page }) => {
    await page.goto("/contact");
    await expectNoSeriousA11yViolations(page);
  });
});

test("nav reaches every sitemap route, and anchors work from a sub-page", async ({ page }) => {
  await page.goto("/services");
  const nav = page.getByRole("banner");
  await nav.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await nav.getByRole("link", { name: "Process", exact: true }).click();
  await expect(page).toHaveURL(/\/#process$/);
  await expect(page.locator("#process")).toBeInViewport();
});
```

> On narrow Playwright projects the desktop nav is hidden. If `playwright.config.ts` runs a mobile project, guard this test with `test.skip(({ isMobile }) => isMobile)`.

- [ ] **Step 2: Document the env var in `README.md`.** Under "Getting started", add:

```md
### Environment
- `ATTIO_API_KEY`: Attio access token with `record_permission:read-write` and `note:read-write` scopes. Needed by `/api/contact` (the Say Hello form). Set it in `.env.local` locally and in Vercel (Preview + Production).
```

- [ ] **Step 3: Run the full suite.** Run `npm run typecheck && npm test && npm run build && npm run test:e2e`. Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add e2e/pages.spec.ts README.md
git commit -m "E2E for contact and cross-route nav; document ATTIO_API_KEY"
```

- [ ] **Step 5 (manual, after deploy): Live Attio check.** Add `ATTIO_API_KEY` in Vercel. Submit the form on the preview URL, then confirm the Person and the "Website: Say Hello" note appear in Attio.

---

## Final verification
- The build output lists exactly: `/`, `/work`, `/work/kenchan-ramen`, `/services`, `/services/retainers`, `/services/activation-diagnostic`, `/contact`, `/api/contact`, `/privacy`, `/terms`. It contains no `template`, `disco`, `lendzi`, `nutrisnap` or `funding-solutions` pages.
- Screenshot each new route at 1440px and 390px wide into `.context/`.
- Open stacked PRs (PR1 → main, PR2 → PR1, PR3 → PR2, PR4 → PR3), then check out the PR4 branch so Conductor shows it.
