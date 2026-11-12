"use client";

import { useEffect } from "react";
// `window.dataLayer` is declared once, globally, in src/lib/offerClick.ts.

/** Pushes one `booking_confirmed` event to GTM's dataLayer when a thank-you page loads. */
export function TrackBooking({ offer }: { offer: string }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "booking_confirmed", offer });
  }, [offer]);
  return null;
}
