"use client";

import { useEffect, useRef } from "react";

/**
 * Stripe-style column grid on the 1200px measure: solid outer edges plus dashed lines on
 * column boundaries (every 3 cols at 12-col, every 2 at 8-col, center at 4-col). Draws
 * top-down once when the section reaches 80% of the viewport. Runs through every section,
 * including the hero, Process and the blue closing band (`tone="dark"`). Decorative: aria-hidden, no
 * pointer events (see `.gridlines` in globals.css).
 */
export function Gridlines({ tone = "light" }: { tone?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`gridlines ${tone === "dark" ? "on-dark" : ""}`} aria-hidden>
      <div className="measure">
        <div>
          <i className="edge l" />
          <i className="dash d1" />
          <i className="dash d2" />
          <i className="dash d3" />
          <i className="edge r" />
        </div>
      </div>
    </div>
  );
}
