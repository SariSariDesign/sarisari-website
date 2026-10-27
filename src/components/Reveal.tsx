"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper ("stock the shelf"). Adds `.in` once the element reaches 80% of
 * the viewport (see the `[data-reveal]` rules in globals.css). One-time, no reverse.
 * - default: rises 12px + fades in (400ms ease-out) after `delay`.
 * - `stagger`: the wrapper stays put and its children fill in left to right, 60ms apart
 *   (capped at 300ms), starting 200ms after the section triggers.
 * - `variant="fade"`: opacity only, for statement panels.
 * Reveals immediately without IntersectionObserver; CSS turns it off under reduced motion.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = false,
  variant = "rise",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** ms before this block starts (section headers use 100). */
  delay?: number;
  stagger?: boolean;
  variant?: "rise" | "fade";
  as?: "div" | "ul";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (stagger) {
      Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)));
    }
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal
      data-stagger={stagger ? "" : undefined}
      data-variant={variant}
      className={className}
      style={delay ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
