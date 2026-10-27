"use client";

import { useId, useState } from "react";

type Item = { label: string; body: string };

type Props = {
  items: Item[];
  /** Index open on first render (single-open accordion). -1 for all closed. */
  defaultOpen?: number;
};

/** FAQ accordion (new comp): sentence-case sans question + +/− toggle, single-open. */
export function Accordion({ items, defaultOpen = 0 }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();

  return (
    <div className="w-full border-t border-neutral-300">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.label} className="border-b border-neutral-300">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`${uid}-${i}`}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
            >
              <span className="text-heading-m text-neutral-1000">
                {item.label}
              </span>
              <span
                aria-hidden
                className="text-2xl leading-none text-neutral-600"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id={`${uid}-${i}`}
              role="region"
              className={`accordion-panel grid ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="min-h-0 overflow-hidden" inert={!isOpen}>
                <p className="max-w-[68ch] whitespace-pre-line pb-6 text-body text-neutral-700">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
