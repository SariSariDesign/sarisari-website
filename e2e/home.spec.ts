import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the hero and every anchored section", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Design that turns users into regulars.",
    );
    for (const id of ["hero", "services", "work", "testimonials", "pricing", "about", "faq"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("primary CTAs point at Calendly", async ({ page }) => {
    const cta = page.getByRole("link", { name: /book a call/i }).first();
    await expect(cta).toHaveAttribute("href", /calendly\.com\/sarisari/);
  });

  test("the Kenchan case links to its study page", async ({ page }) => {
    await expect(page.getByRole("link", { name: /kenchan ramen case study/i }).first()).toHaveAttribute(
      "href",
      "/work/kenchan-ramen",
    );
  });

  test("pricing shows Design+, three offers and the free Scorecard", async ({ page }) => {
    const pricing = page.locator("#pricing");
    await expect(pricing.getByText("$8,000+")).toBeVisible();
    await expect(pricing.getByRole("heading", { name: "The Design Partner" })).toBeVisible();
    await expect(pricing.getByText("$1,500")).toBeVisible();
    await expect(pricing.getByText("$6,000")).toBeVisible();
    await expect(pricing.getByRole("link", { name: /get free scorecard/i })).toHaveAttribute(
      "href",
      "/scorecard-preview",
    );
  });

  test("the Scorecard CTAs link to the internal page in the same tab", async ({ page }) => {
    const hero = page.locator("#hero").getByRole("link", { name: /get free scorecard/i });
    const footer = page
      .getByRole("region", { name: /./ })
      .filter({ has: page.locator("#cta-h") })
      .getByRole("link", { name: /get free scorecard/i });
    for (const link of [hero, footer]) {
      await expect(link).toHaveAttribute("href", "/scorecard-preview");
      await expect(link).not.toHaveAttribute("target", "_blank");
    }
  });

  test("the case-study template renders a published study", async ({ page }) => {
    await page.goto("/work/kenchan-ramen");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("37% of Digital Revenue");
  });

  test("FAQ opens one item at a time", async ({ page }) => {
    await page.getByRole("button", { name: /what if it isn't working/i }).click();
    await expect(page.getByText(/you give 30 days notice/i)).toBeVisible();
  });

  test("has no serious or critical accessibility violations", async ({ page }) => {
    // Reduced motion forces reveal content to its settled, fully-visible state, so axe
    // judges the real UI rather than a mid-fade animation frame.
    await page.emulateMedia({ reducedMotion: "reduce" });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
