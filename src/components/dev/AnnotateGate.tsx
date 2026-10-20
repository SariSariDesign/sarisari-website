"use client";

import { type ComponentType, useEffect, useState } from "react";

const KEY = "sarisari:annotate";

/**
 * Opt-in Agentation feedback toolbar outside local dev, so reviewers can annotate a
 * deployed build. On when either:
 *   - this is a Vercel preview deployment (NEXT_PUBLIC_VERCEL_ENV === "preview"), or
 *   - the visitor opened any page with `?annotate` (remembered in localStorage;
 *     `?annotate=off` turns it back off).
 * The toolbar is a lazy chunk fetched only when on, so regular visitors never load it.
 * Annotations copy to the clipboard as markdown to paste back into the conversation.
 */
export function AnnotateGate() {
  const [Toolbar, setToolbar] = useState<ComponentType | null>(null);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("annotate");
    try {
      if (flag === "off") localStorage.removeItem(KEY);
      else if (flag !== null) localStorage.setItem(KEY, "1");
    } catch {
      // Storage blocked (private mode etc.): fall back to the URL flag alone.
    }
    let remembered = false;
    try {
      remembered = localStorage.getItem(KEY) === "1";
    } catch {}
    const on =
      process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
      remembered ||
      (flag !== null && flag !== "off");
    if (!on) return;
    import("agentation").then((m) => setToolbar(() => m.Agentation));
  }, []);

  return Toolbar ? <Toolbar /> : null;
}
