"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/content/site";
import { Gridlines } from "./Gridlines";
import { SectionHeader } from "./SectionHeader";

const PIN_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** Vertical scroll per pixel of sideways travel (>1 = slower). */
const PACE = 1.6;

/**
 * "Ask our regulars." One-row carousel: 3 cards visible on desktop, 2 on tablet, 1 + peek
 * on mobile, square arrows top-right.
 *
 * From 768px up with motion allowed, the section pins below the nav and vertical scrolling
 * moves the row sideways. The section is exactly as tall as the row's overflow, so it lets
 * go when the last card reaches the grid's right edge. Arrows scroll the page by one card.
 * On mobile or under reduced motion it is a normal swipe carousel and the arrows page it.
 */
export function TestimonialCarousel({
  headline,
  items,
}: {
  headline: string;
  items: Testimonial[];
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [overflow, setOverflow] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Measure and wire up pin vs. swipe mode.
  useEffect(() => {
    const sec = section.current;
    const el = track.current;
    if (!sec || !el) return;
    const mq = window.matchMedia(PIN_QUERY);
    let raf = 0;
    let travel = 0;

    const measure = () => {
      el.style.transform = "";
      travel = Math.max(0, el.scrollWidth - el.clientWidth);
      setOverflow(travel);
    };
    const applyPin = () => {
      raf = 0;
      const top = sec.getBoundingClientRect().top - 76; // nav height
      const p = travel ? clamp01(-top / (travel * PACE)) : 0;
      el.style.transform = `translate3d(${-p * travel}px, 0, 0)`;
      setAtStart(p <= 0.001);
      setAtEnd(p >= 0.999);
    };
    const syncSwipe = () => {
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(applyPin);
    };
    const onResize = () => {
      measure();
      if (mq.matches) applyPin();
      else syncSwipe();
    };
    const sync = () => {
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("scroll", syncSwipe);
      const pin = mq.matches;
      setPinned(pin);
      measure();
      if (pin) {
        el.scrollLeft = 0;
        applyPin();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        el.style.transform = "";
        syncSwipe();
        el.addEventListener("scroll", syncSwipe, { passive: true });
      }
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scroll", syncSwipe);
      cancelAnimationFrame(raf);
    };
  }, []);

  const step = useCallback(() => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card.offsetWidth + gap;
  }, []);

  const page = (dir: 1 | -1) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior = reduce ? "auto" : "smooth";
    if (pinned) window.scrollBy({ top: dir * step() * PACE, behavior });
    else track.current?.scrollBy({ left: dir * step(), behavior });
  };

  return (
    <section
      ref={section}
      id="testimonials"
      aria-labelledby="testimonials-h"
      className="relative bg-neutral-100"
      style={
        pinned ? { height: `calc(100svh - 76px + ${Math.round(overflow * PACE)}px)` } : undefined
      }
    >
      <Gridlines />
      <div
        className={`relative z-[1] flex flex-col justify-center overflow-hidden ${
          pinned ? "sticky top-[76px] h-[calc(100svh-76px)]" : "section-full"
        }`}
      >
        <div className="measure">
          <div className="flex items-center justify-between gap-4">
            <SectionHeader
              headingId="testimonials-h"
              headline={headline}
              className=""
            />
            <div className="flex shrink-0 gap-2">
              <ArrowButton
                label="Previous testimonial"
                dir={-1}
                disabled={atStart}
                onClick={() => page(-1)}
              />
              <ArrowButton
                label="Next testimonial"
                dir={1}
                disabled={atEnd}
                onClick={() => page(1)}
              />
            </div>
          </div>
          {/* Clip at the left gridline (8px outside the content) so cards leave the screen
              there instead of sliding under the tick nav; they still enter from the right. */}
          <div className={pinned ? "[clip-path:inset(0_-100vw_0_-8px)]" : ""}>
            <ul
              ref={track}
              tabIndex={pinned ? -1 : 0}
              aria-label="Testimonials"
              className={`carousel-track mt-12 flex gap-4 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300 ${
                pinned
                  ? "overflow-visible"
                  : "snap-x snap-mandatory overflow-x-auto"
              }`}
            >
              {items.map((t) => (
                <li
                  key={t.name}
                  className="flex w-[85%] shrink-0 snap-start md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
                >
                  <TestimonialCard t={t} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex min-h-[320px] w-full flex-col justify-between gap-8 rounded border border-neutral-300 bg-white p-8 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-100">
      <blockquote className="text-body text-neutral-800">
        “{t.quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {t.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.photo} alt="" className="h-10 w-10 rounded object-cover" />
        )}
        <span className="flex flex-col gap-1">
          <span className="ds-label text-label text-neutral-1000">
            {t.name}
          </span>
          <span className="ds-label text-label text-neutral-700">
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
      className="group flex h-12 w-12 items-center justify-center rounded border border-neutral-1000 text-neutral-1000 transition-colors duration-150 ease-out hover:bg-neutral-1000 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-1000"
    >
      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        aria-hidden
        className={`line-icon ${dir < 0 ? "nudge-back" : "nudge-x"}`}
      >
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
