"use client";

import { useState } from "react";

/**
 * Pricing tablist — toggles between the Retainer and Diagnostic panels (rendered on the
 * server and passed in as nodes). Retainer is the default tab.
 */
export function PricingTabs({
  labels,
  retainer,
  diagnostic,
}: {
  labels: { retainer: string; diagnostic: string };
  retainer: React.ReactNode;
  diagnostic: React.ReactNode;
}) {
  const [tab, setTab] = useState<"retainer" | "diagnostic">("retainer");

  const seg = (active: boolean) =>
    `ds-label rounded-full px-6 py-2.5 text-label-m transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 ${
      active
        ? "bg-white text-primary-500 shadow-sm"
        : "text-neutral-700 hover:text-neutral-1000"
    }`;

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Pricing options"
        className="inline-flex self-start gap-1 rounded-full border border-neutral-300 bg-neutral-200 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "retainer"}
          className={seg(tab === "retainer")}
          onClick={() => setTab("retainer")}
        >
          {labels.retainer}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "diagnostic"}
          className={seg(tab === "diagnostic")}
          onClick={() => setTab("diagnostic")}
        >
          {labels.diagnostic}
        </button>
      </div>
      <div role="tabpanel">{tab === "retainer" ? retainer : diagnostic}</div>
    </div>
  );
}
