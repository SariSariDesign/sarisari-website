"use client";

import { useEffect } from "react";

const NAV = 76;
/** Only settle when a section top is this close (share of the viewport) to the nav line. */
const RANGE = 0.25;
/** How long the page has to be quiet before the glide takes over. */
const IDLE_MS = 90;
/** Glide length bounds. */
const MIN_MS = 700;
const MAX_MS = 1800;
/** Ease-out: starts at full speed and decelerates, so it carries on from the scroll. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Gentle "snap to section". When scrolling down winds down and a section's top is within
 * 25% of the viewport below the nav line, the page glides the rest of the way.
 *
 * Smooth hand-off: the glide starts at the speed the page was last moving and only
 * decelerates (ease-out), with its length set from that speed, so it reads as the
 * scroll's own momentum finishing rather than a second push.
 *
 * Forward only (never pulls back up to a section already passed, never while scrolling
 * up); mid-way through a tall section nothing is in range, so nothing moves. Any wheel,
 * touch, key or click cancels it. Off under reduced motion.
 */
export function SnapScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let raf = 0;
    let gliding = false;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let velocity = 0; // px/ms, smoothed; positive = down

    const cancel = () => {
      if (!gliding) return;
      cancelAnimationFrame(raf);
      gliding = false;
    };

    const glide = (delta: number) => {
      const from = window.scrollY;
      const start = performance.now();
      // easeOut starts at 3 × average speed; match it to the scroll's last speed.
      const v = Math.max(velocity, 0.05);
      const duration = Math.min(MAX_MS, Math.max(MIN_MS, (3 * delta) / v));
      gliding = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // "instant" so the page-level smooth scrolling doesn't fight each frame.
        window.scrollTo({ top: from + delta * easeOut(t), behavior: "instant" });
        if (t < 1 && gliding) raf = requestAnimationFrame(step);
        else
          window.setTimeout(() => {
            gliding = false;
            lastY = window.scrollY;
            velocity = 0;
          }, 50);
      };
      raf = requestAnimationFrame(step);
    };

    const settle = () => {
      if (gliding || velocity <= 0) return;
      const vh = window.innerHeight;
      const line = window.scrollY + NAV;
      let best: number | null = null;
      document.querySelectorAll<HTMLElement>("main > section, [data-dark-band]").forEach((el) => {
        const d = el.getBoundingClientRect().top + window.scrollY - line;
        if (d > 2 && d < vh * RANGE && (best === null || d < best)) best = d;
      });
      if (best !== null) glide(best);
    };

    const onScroll = () => {
      if (gliding) return;
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(1, now - lastT);
      velocity = velocity * 0.6 + ((y - lastY) / dt) * 0.4;
      lastY = y;
      lastT = now;
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, IDLE_MS);
    };
    const inputs = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    window.addEventListener("scroll", onScroll, { passive: true });
    inputs.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
    return () => {
      window.removeEventListener("scroll", onScroll);
      inputs.forEach((e) => window.removeEventListener(e, cancel));
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
