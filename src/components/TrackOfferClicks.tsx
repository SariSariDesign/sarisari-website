"use client";

import { useEffect } from "react";
import { buildOfferClickPayload, pushOfferClick } from "@/lib/offerClick";

/**
 * One delegated click listener for every offer CTA (`a[data-offer-cta]`) on the page.
 * Pushes an `offer_cta_click` event to GTM's dataLayer; renders nothing.
 */
export function TrackOfferClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[data-offer-cta]");
      if (!anchor) return;
      const payload = buildOfferClickPayload(anchor);
      if (payload) pushOfferClick(payload);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
