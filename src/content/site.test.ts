import { describe, expect, it } from "vitest";
import { BOOKING_URL, diagnostic, faq, nav, pricing, retainers, servicesPage } from "./site";

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

describe("services content", () => {
  it("links the homepage pricing section to the retainer comparison", () => {
    expect(pricing.compare.href).toBe("/services/retainers");
  });

  it("pulls its FAQ subset from the main FAQ", () => {
    const qs = faq.items.map((f) => f.q);
    for (const item of servicesPage.faqItems()) expect(qs).toContain(item.label);
    expect(servicesPage.faqItems().length).toBeGreaterThan(0);
    expect(servicesPage.faqItems().length).toBe(servicesPage.faqQuestions.length);
  });

  it("offers Grow and Scale retainers, Scale at the current price", () => {
    expect(retainers.tiers.map((t) => t.name)).toEqual(["Grow", "Scale"]);
    expect(retainers.tiers[1].price).toBe("$16,000");
  });

  it("shows Audit and Diagnostic but not Build", () => {
    expect(diagnostic.tiers.map((t) => t.name)).toEqual(["Audit", "Diagnostic"]);
  });
});
