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

  const pill = (active: boolean) =>
    `ds-label rounded-full px-5 py-2 text-label-m transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 ${
      active
        ? "bg-primary-400 text-neutral-100"
        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
    }`;

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label="Pricing options" className="flex flex-wrap gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "retainer"}
          className={pill(tab === "retainer")}
          onClick={() => setTab("retainer")}
        >
          {labels.retainer}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "diagnostic"}
          className={pill(tab === "diagnostic")}
          onClick={() => setTab("diagnostic")}
        >
          {labels.diagnostic}
        </button>
      </div>
      <div role="tabpanel">{tab === "retainer" ? retainer : diagnostic}</div>
    </div>
  );
}
