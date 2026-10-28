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
    await expect(page.getByRole("link", { name: /disco case study/i })).toHaveAttribute(
      "href",
      "/work/disco",
    );
    await expect(page.getByRole("link", { name: /lendzi case study/i })).toHaveCount(0);
  });

  test("the template and drafts have no page", async ({ page }) => {
    for (const slug of ["template", "lendzi", "nutrisnap"]) {
      const res = await page.goto(`/work/${slug}`);
      expect(res?.status()).toBe(404);
    }
  });

  test("is accessible", async ({ page }) => {
    await page.goto("/work");
    await expectNoSeriousA11yViolations(page);
  });
});

test.describe("/services", () => {
  test("overview links to both offer pages", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByRole("link", { name: /compare retainers/i })).toHaveAttribute("href", "/services/retainers");
    await expect(page.getByRole("link", { name: /learn about the diagnostic/i })).toHaveAttribute(
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

test.describe("/contact", () => {
  test("embeds Calendly and submits the form", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true } }));
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
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

test("nav reaches every sitemap route, and anchors work from a sub-page", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav");
  await page.goto("/services");
  const nav = page.getByRole("banner");
  await nav.getByRole("link", { name: "Pricing", exact: true }).click();
  await expect(page).toHaveURL(/\/#pricing$/);
  await expect(page.locator("#pricing")).toBeInViewport();
});
