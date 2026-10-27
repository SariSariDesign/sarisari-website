"use client";

import { useEffect, useRef } from "react";
import { pointOfView } from "@/content/site";

const PIN_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Process: the belief statement and the three principles in one pinned "moment" (grain
 * on, gridlines off). From 768px up with motion allowed, the stage sticks below the nav
 * while the section scrolls ~3.4 screens: the statement stays at the top of the screen and
 * P1, P2, P3 rise into their columns at the bottom, driven by scroll (ease-out, no bounce).
 * Once P3 is in, everything scrolls away together. The hand-drawn circle around "clear"
 * draws once (800ms) when the stage is centered in the viewport. Below 768px or under
 * reduced motion: statement then principles, stacked and static.
 */
export function Process() {
  const wrap = useRef<HTMLElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  // Underline: draw once when the section's stage reaches the viewport center.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("drawn");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("drawn");
          io.disconnect();
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pin + principles rising in.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const mq = window.matchMedia(PIN_QUERY);
    let raf = 0;

    const apply = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      // 0 when the stage pins; 1 a little before it lets go (the last 15% is a hold).
      const p = clamp01(-rect.top / (travel * 0.85));
      items.current.forEach((li, i) => {
        if (!li) return;
        const t = easeOut(clamp01(p * 3 - i));
        li.style.transform = `translateY(${(1 - t) * 50}vh)`;
        li.style.opacity = String(clamp01(t * 1.5));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () =>
      items.current.forEach((li) => {
        if (!li) return;
        li.style.transform = "";
        li.style.opacity = "";
      });
    const sync = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (!mq.matches) {
        el.dataset.pinned = "false";
        reset();
        return;
      }
      el.dataset.pinned = "true";
      apply();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      reset();
    };
  }, []);

  const { line1, line2, principles } = pointOfView;
  return (
    <section
      ref={wrap}
      id="process"
      aria-label="Our process"
      data-pinned="false"
      className="process grain relative bg-neutral-100"
    >
      <div className="process-stage relative z-[1] flex flex-col overflow-hidden">
        <div className="measure flex flex-1 flex-col justify-between gap-16">
          {/* Statement: top of the screen. */}
          <p className="process-statement font-brand text-display-l text-neutral-1000">
            <span className="block">{line1}</span>
            <span className="block italic">
              {line2.before}
              <span className="relative inline-block">
                {line2.underline}
                {/* Hand-drawn circle around the word: one loose stroke that overshoots
                    where it started, drawn once. Sized to the word, so it scales. */}
                <svg
                  aria-hidden
                  viewBox="0 0 220 100"
                  preserveAspectRatio="none"
                  className="statement-underline pointer-events-none absolute left-[-14%] top-[-6%] h-[118%] w-[128%] overflow-visible"
                >
                  <path
                    d="M150 14 C 118 4, 58 6, 26 24 C 4 37, 6 70, 40 84 C 82 100, 160 96, 196 74 C 222 58, 214 26, 178 14 C 150 5, 104 6, 76 12"
                    fill="none"
                    stroke="var(--color-primary-300)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                  />
                </svg>
              </span>
              {line2.after}
            </span>
          </p>
          {/* Principles: bottom of the screen, rising in one by one. */}
          <ul className="grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-8 lg:grid-cols-12">
            {principles.map((p, i) => (
              <li
                key={p.title}
                ref={(li) => void (items.current[i] = li)}
                className="col-span-full flex flex-col gap-4 border-t border-neutral-1000 pt-6 md:col-span-4 lg:col-span-4"
              >
                <h3 className="text-heading-l text-neutral-1000">{p.title}</h3>
                <p className="text-body text-neutral-700">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
