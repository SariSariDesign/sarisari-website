"use client";

import { useCallback, useEffect, useState } from "react";

/** Homepage sections in page order. Ones not yet on the page are skipped at runtime. */
export const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "use-cases", label: "Use cases" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "point-of-view", label: "Point of view" },
  { id: "testimonials", label: "Testimonials" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "Team" },
  { id: "faq", label: "FAQ" },
];

const MAX = 48;
const STEP = 10;
const MIN = 14;

/**
 * Stripe Press-style table of contents, fixed to the left browser edge (≥768px).
 * One horizontal tick per section, no column, rule or background. Ticks widen toward the
 * hovered or current section (48px max, −10px per step away, 14px min, 150ms ease-out);
 * the current tick is ink, the rest muted. Labels: section name at ≥1440px (where the
 * outer margin has room); below that, the current section number above the ticks. Click scrolls to the
 * section. Below 768px it becomes a sticky bottom bar: "01 · Hero" + progress segments.
 */
export function TickNav() {
  const [sections, setSections] = useState(SECTIONS);
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const present = SECTIONS.filter((s) => document.getElementById(s.id));
    setSections(present);
    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      let idx = 0;
      present.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      setCurrent(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  const focus = hover ?? current;
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <>
      {/* ≥768px: left-edge ticks */}
      <nav
        aria-label="Sections"
        className="fixed left-2 top-1/2 z-40 hidden -translate-y-1/2 md:block"
        onMouseLeave={() => setHover(null)}
      >
        {/* 768–1439px: current section number only, above the ticks so it never
            crosses into the content column. */}
        <span aria-hidden className="ds-label mb-2 block text-label text-neutral-1000 min-[1440px]:hidden">
          {num(current)}
        </span>
        <ul className="flex flex-col">
          {sections.map((s, i) => {
            const width = Math.max(MIN, MAX - STEP * Math.abs(i - focus));
            const isCurrent = i === current;
            const showName = i === focus;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={s.label}
                  aria-current={isCurrent ? "true" : undefined}
                  className="group flex h-3 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                >
                  <span
                    aria-hidden
                    className={`block h-px transition-[width,background-color] duration-150 ease-out ${
                      isCurrent ? "bg-neutral-1000" : "bg-neutral-500"
                    }`}
                    style={{ width }}
                  />
                  {/* ≥1440px: section name beside the hovered/current tick */}
                  {showName && (
                    <span aria-hidden className="ds-label hidden whitespace-nowrap text-label text-neutral-1000 min-[1440px]:inline">
                      {s.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* <768px: sticky bottom bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex h-11 items-center gap-4 border-t border-neutral-300 bg-neutral-100 px-4 md:hidden"
        aria-hidden
      >
        <span className="ds-label shrink-0 text-label text-neutral-1000">
          {num(current)} · {sections[current]?.label}
        </span>
        <span className="flex flex-1 gap-1">
          {sections.map((s, i) => (
            <span
              key={s.id}
              className={`h-0.5 flex-1 transition-colors duration-150 ease-out ${i <= current ? "bg-neutral-1000" : "bg-neutral-400"}`}
            />
          ))}
        </span>
      </div>
      {/* Keeps the footer clear of the bottom bar on mobile. */}
      <div className="h-11 md:hidden" aria-hidden />
    </>
  );
}
