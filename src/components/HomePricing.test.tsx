import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePricing } from "./HomePricing";

describe("HomePricing", () => {
  it("tags the Audit card CTA as an offer CTA", () => {
    const { container } = render(<HomePricing />);
    const cta = container.querySelector<HTMLAnchorElement>('#offer-audit a[data-offer-cta]');
    expect(cta).not.toBeNull();
    expect(cta).toHaveAttribute("data-offer-id", "offer-audit");
    expect(cta).toHaveAttribute("data-offer-name", "The Audit");
    expect(cta).toHaveAttribute("data-cta-placement", "home_pricing");
  });

  it("tags the Scale card and Scorecard CTAs, not the grow link", () => {
    const { container } = render(<HomePricing />);
    const ids = [...container.querySelectorAll("a[data-offer-cta]")].map((a) =>
      a.getAttribute("data-offer-id"),
    );
    expect(ids).toEqual([
      "offer-design-plus",
      "offer-audit",
      "offer-diagnostic",
      "offer-design-partner",
      "offer-scorecard",
    ]);
  });
});
