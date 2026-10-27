"use client";

import { useId, useState } from "react";
import type { Service } from "@/content/site";
import { Button } from "./Button";
import { Placeholder } from "./Placeholder";

/**
 * Services as a numbered, single-open list. Each row starts condensed (number + title);
 * opening it reveals a piece of relevant media, the description, optional capability
 * bullets, and an optional link. The drawer animates open via grid-template-rows so the
 * height transition needs no measuring; it is instant under reduced motion.
 */
export function ServicesList({ items, defaultOpen = 0 }: { items: Service[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();

  return (
    <ul className="mt-16 border-t border-neutral-400">
      {items.map((s, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const buttonId = `${base}-button-${i}`;
        return (
          <li key={s.title} className="border-b border-neutral-400">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-4 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300 md:gap-10 md:py-6"
              >
                <span className="ds-label w-10 shrink-0 text-label-m text-neutral-700 md:w-16">
                  {s.n}
                </span>
                <span className="flex-1 text-[clamp(22px,2.4vw,33px)] font-medium leading-[1.1] tracking-[-0.01em] text-neutral-1000 transition-colors group-hover:text-primary-400">
                  {s.title}
                </span>
                <PlusMinus open={isOpen} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`services-drawer grid ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="min-h-0 overflow-hidden" inert={!isOpen}>
                <div className="grid gap-4 pb-8 md:grid-cols-2 md:pl-[104px]">
                  <div className="aspect-[4/3] overflow-hidden">
                    {s.media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.media} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Placeholder className="h-full w-full" label={`${s.title} — media pending`} />
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="text-body-l text-neutral-800">{s.body}</p>
                    {s.points && s.points.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {s.points.map((p) => (
                          <li key={p} className="flex gap-3 text-body-m text-neutral-700">
                            <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-neutral-500" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.link && (
                      <div className="mt-auto">
                        <Button href={s.link.href} variant="ghost">
                          {s.link.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Drawn plus that collapses to a minus when open (the vertical stroke folds away). */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" aria-hidden className="shrink-0 text-primary-400">
      <path d="M2 14h24" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 2v24"
        stroke="currentColor"
        strokeWidth="2"
        className={`origin-center transition-transform duration-300 ease-out ${open ? "scale-y-0" : "scale-y-100"}`}
      />
    </svg>
  );
}
