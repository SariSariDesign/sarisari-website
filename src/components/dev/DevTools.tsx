"use client";

import { Agentation } from "agentation";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";

/**
 * Dev-only visual tooling. Agentation = click-to-annotate feedback toolbar
 * (bottom-right). DialKit = live control panel (bottom-left, to clear the
 * Agentation toolbar); empty until controls are wired via `useDialKit`.
 * Mounted only from the NODE_ENV==="development" branch in layout.tsx, so both
 * modules are tree-shaken out of production and never ship to real visitors.
 */
export function DevTools() {
  return (
    <>
      <Agentation />
      <DialRoot position="bottom-left" />
    </>
  );
}
