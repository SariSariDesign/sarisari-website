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
