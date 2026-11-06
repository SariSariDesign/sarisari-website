"use client";

import { type ComponentType, useEffect, useState } from "react";

const KEY = "sarisari:annotate";

/**
 * Agentation feedback toolbar outside local dev (which gets it via DevTools).
 *   - Vercel preview deployments: always on.
 *   - Production: off unless the page is opened with `?annotate`. The opt-in lasts for
 *     the browser tab (sessionStorage) so it survives navigation, and ends when the tab
 *     closes. `?annotate=off` turns it off sooner.
 * The old opt-in lived in localStorage and stuck forever; that key is cleared on load.
 * The toolbar is a lazy chunk fetched only when on, so regular visitors never load it.
 * Annotations copy to the clipboard as markdown to paste back into the conversation.
 */
export function AnnotateGate() {
  const [Toolbar, setToolbar] = useState<ComponentType | null>(null);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("annotate");
    let remembered = false;
    try {
      localStorage.removeItem(KEY);
      if (flag === "off") sessionStorage.removeItem(KEY);
      else if (flag !== null) sessionStorage.setItem(KEY, "1");
      remembered = sessionStorage.getItem(KEY) === "1";
    } catch {
      // Storage blocked (private mode etc.): fall back to the URL flag alone.
    }
    const on =
      process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
      remembered ||
      (flag !== null && flag !== "off");
    if (!on) return;
    import("agentation").then((m) => setToolbar(() => m.Agentation));
  }, []);

  return Toolbar ? <Toolbar /> : null;
}
