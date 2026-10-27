"use client";

import { useEffect, useRef } from "react";
import { pointOfView } from "@/content/site";
import { Reveal } from "./Reveal";

/**
 * Point of view: a full-screen belief statement. Editorial Old at display size, left
 * aligned on the 12-column measure, grain on, gridlines off, text fades in (no movement).
 * A hand-drawn underline under "clear" draws left to right (800ms ease-out) once, when the
 * panel's center reaches the viewport's center. It is sized to the word, so it scales.
 */
export function StatementPanel() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("drawn");
      return;
    }
    // A zero-height band at the viewport's vertical center.
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

  const { line1, line2 } = pointOfView;
  return (
    <section
      ref={ref}
      id="point-of-view"
      aria-label="Our point of view"
      className="statement grain flex min-h-[calc(100svh-76px)] flex-col justify-center bg-neutral-100"
    >
      <div className="measure relative z-[1] py-16">
        <Reveal variant="fade">
          <p className="font-brand text-display-l text-neutral-1000">
            <span className="block">{line1}</span>
            <span className="block italic">
              {line2.before}
              <span className="relative inline-block">
                {line2.underline}
                <svg
                  aria-hidden
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                  className="statement-underline absolute left-[-2%] top-[92%] h-[0.16em] w-[104%] overflow-visible"
                >
                  <path
                    d="M2 13 C 30 6, 58 15, 88 10 S 150 5, 172 11 C 182 13, 192 9, 198 8"
                    fill="none"
                    stroke="var(--color-primary-400)"
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
        </Reveal>
      </div>
    </section>
  );
}
