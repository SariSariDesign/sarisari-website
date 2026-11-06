"use client";

import { type ComponentType, useEffect, useState } from "react";

/** Legacy opt-in key from the old `?annotate` flag; cleared so it can't linger. */
const LEGACY_KEY = "sarisari:annotate";

const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

/**
 * Agentation feedback toolbar for Vercel preview deployments only, so reviewers can
 * annotate a deployed branch. Production never loads it: NEXT_PUBLIC_VERCEL_ENV is
 * inlined at build time, so the `import("agentation")` chunk is dropped from
 * production bundles. (Local dev gets the toolbar via DevTools instead.)
 * Annotations copy to the clipboard as markdown to paste back into the conversation.
 */
export const AnnotateGate = IS_PREVIEW ? PreviewToolbar : ClearLegacyFlag;

function PreviewToolbar() {
  const [Toolbar, setToolbar] = useState<ComponentType | null>(null);

  useEffect(() => {
    import("agentation").then((m) => setToolbar(() => m.Agentation));
  }, []);

  return Toolbar ? <Toolbar /> : null;
}

function ClearLegacyFlag() {
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      // Storage blocked (private mode etc.): nothing to clear.
    }
  }, []);

  return null;
}
