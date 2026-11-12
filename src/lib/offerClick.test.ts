import { afterEach, describe, expect, it } from "vitest";
import {
  buildOfferClickPayload,
  OFFER_CTA_CLICK_EVENT,
  offerCtaData,
  offerSlug,
  pushOfferClick,
} from "./offerClick";

function anchor(attrs: Record<string, string>, html = "Book a call"): HTMLAnchorElement {
  const a = document.createElement("a");
  for (const [k, v] of Object.entries(attrs)) a.setAttribute(k, v);
  a.innerHTML = html;
  return a;
}

afterEach(() => {
  delete window.dataLayer;
});

describe("buildOfferClickPayload", () => {
  it("builds the payload from an instrumented anchor", () => {
    const a = anchor(
      {
        href: "https://calendly.com/sarisari/audit",
        "data-offer-cta": "",
        "data-offer-id": "offer-audit",
        "data-offer-name": "The Audit",
        "data-cta-placement": "home_pricing",
      },
      "  Book a call <svg aria-hidden></svg> ",
    );
    expect(buildOfferClickPayload(a)).toEqual({
      offer_id: "offer-audit",
      offer_name: "The Audit",
      cta_label: "Book a call",
      cta_destination: "https://calendly.com/sarisari/audit",
      cta_placement: "home_pricing",
    });
  });

  it("uses the href as written, not the resolved URL", () => {
    const a = anchor({ href: "/scorecard-preview", "data-offer-cta": "" });
    expect(buildOfferClickPayload(a)?.cta_destination).toBe("/scorecard-preview");
  });

  it("returns null for an anchor without data-offer-cta", () => {
    expect(buildOfferClickPayload(anchor({ href: "/terms", "data-offer-id": "offer-audit" }))).toBeNull();
  });
});

describe("pushOfferClick", () => {
  const payload = {
    offer_id: "offer-audit",
    offer_name: "The Audit",
    cta_label: "Book a call",
    cta_destination: "/x",
    cta_placement: "home_pricing",
  };

  it("creates window.dataLayer if missing and pushes the event", () => {
    expect(window.dataLayer).toBeUndefined();
    pushOfferClick(payload);
    expect(window.dataLayer).toEqual([{ event: OFFER_CTA_CLICK_EVENT, ...payload }]);
    expect(OFFER_CTA_CLICK_EVENT).toBe("offer_cta_click");
  });

  it("appends to an existing dataLayer", () => {
    window.dataLayer = [{ event: "gtm.js" }];
    pushOfferClick(payload);
    expect(window.dataLayer).toHaveLength(2);
  });
});

describe("offerCtaData", () => {
  it("uses the offer id when present", () => {
    expect(offerCtaData({ id: "offer-scale", name: "Scale" }, "retainer_panel")).toEqual({
      "data-offer-cta": "",
      "data-offer-id": "offer-scale",
      "data-offer-name": "Scale",
      "data-cta-placement": "retainer_panel",
    });
  });

  it("derives a kebab-case id from the name when id is missing", () => {
    expect(offerCtaData({ name: "Grow" }, "retainer_panel")["data-offer-id"]).toBe("offer-grow");
    expect(offerSlug("Activation Diagnostic")).toBe("offer-activation-diagnostic");
  });
});
