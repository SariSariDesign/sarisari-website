/**
 * Offer CTA click tracking. Offer CTAs carry `data-offer-*` attributes (see `offerCtaData`);
 * `TrackOfferClicks` listens for clicks on them and pushes one `offer_cta_click` event to
 * GTM's dataLayer. Nothing here sends data anywhere: GTM decides what (if anything) goes out.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const OFFER_CTA_CLICK_EVENT = "offer_cta_click";

/** Which component the CTA lives in. */
export type CtaPlacement = "home_pricing" | "offer_grid" | "offer_cards" | "retainer_panel";

export type OfferClickPayload = {
  offer_id: string;
  offer_name: string;
  cta_label: string;
  cta_destination: string;
  cta_placement: string;
};

export type OfferCtaData = {
  "data-offer-cta": string;
  "data-offer-id": string;
  "data-offer-name": string;
  "data-cta-placement": CtaPlacement;
};

/** "The Design Partner" -> "offer-the-design-partner". Used when an offer has no id. */
export function offerSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `offer-${slug}`;
}

/** Data attributes for an offer CTA anchor. Falls back to a slug of the name when id is missing. */
export function offerCtaData(offer: { id?: string; name: string }, placement: CtaPlacement): OfferCtaData {
  return {
    "data-offer-cta": "",
    "data-offer-id": offer.id || offerSlug(offer.name),
    "data-offer-name": offer.name,
    "data-cta-placement": placement,
  };
}

/** Builds the event payload from an instrumented anchor, or null if it is not an offer CTA. */
export function buildOfferClickPayload(anchor: HTMLAnchorElement): OfferClickPayload | null {
  if (!anchor.hasAttribute("data-offer-cta")) return null;
  return {
    offer_id: anchor.getAttribute("data-offer-id") ?? "",
    offer_name: anchor.getAttribute("data-offer-name") ?? "",
    cta_label: (anchor.textContent ?? "").replace(/\s+/g, " ").trim(),
    // The href as written in the markup, never the current page's URL or query string.
    cta_destination: anchor.getAttribute("href") ?? "",
    cta_placement: anchor.getAttribute("data-cta-placement") ?? "",
  };
}

/** Pushes `{ event: "offer_cta_click", ...payload }` to GTM's dataLayer. */
export function pushOfferClick(payload: OfferClickPayload): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: OFFER_CTA_CLICK_EVENT, ...payload });
}
