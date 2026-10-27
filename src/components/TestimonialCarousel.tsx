"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/content/site";
import { Placeholder } from "./Placeholder";

/**
 * Testimonials as a horizontal carousel: a native scroll-snap track (swipe/trackpad/keys
 * all work) with previous/next buttons that page by one card and disable at the ends.
 * Pending quotes render as placeholder cards so the named slots stay visible.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="mt-12">
      <ul
        ref={track}
        // Focusable so keyboard users can scroll it with the arrow keys.
        tabIndex={0}
        className="carousel-track flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300"
        aria-label="Testimonials"
      >
        {items.map((t) => (
          <li
            key={t.name}
            className="flex w-[85%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            <TestimonialCard t={t} />
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-3">
        <ArrowButton label="Previous testimonials" dir={-1} disabled={atStart} onClick={() => page(-1)} />
        <ArrowButton label="Next testimonials" dir={1} disabled={atEnd} onClick={() => page(1)} />
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  if (!t.quote) {
    return (
      <Placeholder
        className="min-h-[280px] w-full"
        rounded={false}
        label={`${t.name} — quote pending`}
      />
    );
  }
  return (
    <figure className="flex min-h-[280px] w-full flex-col justify-between gap-8 border border-neutral-300 bg-white p-8 transition-colors duration-150 ease-out hover:border-neutral-1000">
      <blockquote className="text-body-m text-neutral-800">“{t.quote}”</blockquote>
      <figcaption className="flex items-center gap-3">
        {t.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.photo} alt="" className="h-10 w-10 object-cover" />
        )}
        <span className="flex flex-col">
          <span className="text-title-s font-medium text-neutral-1000">{t.name}</span>
          <span className="ds-label text-label-s text-neutral-700">
            {[t.role, t.company].filter(Boolean).join(", ")}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function ArrowButton({
  label,
  dir,
  disabled,
  onClick,
}: {
  label: string;
  dir: 1 | -1;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="group flex h-12 w-12 items-center justify-center border border-neutral-400 text-neutral-1000 transition-colors duration-150 ease-out hover:border-primary-400 hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 disabled:cursor-default disabled:opacity-35 disabled:hover:border-neutral-400 disabled:hover:text-neutral-1000"
    >
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden className={`line-icon ${dir < 0 ? "nudge-back" : "nudge-x"}`}>
        <path
          d={dir < 0 ? "M8 1L1 8l7 7M1 8h16" : "M10 1l7 7-7 7M17 8H1"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          pathLength={1}
        />
      </svg>
    </button>
  );
}
