"use client";

import { useEffect, useRef } from "react";
import { pointOfView } from "@/content/site";
import { Gridlines } from "./Gridlines";

const PIN_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * The three principles, pinned. From 768px up with motion allowed, the block sticks to
 * the viewport (below the nav) while the section scrolls ~2.6 screens: P1 rises into its
 * column, then P2, then P3, each driven by scroll position (ease-out, no bounce). Once P3
 * is in, the block scrolls away together. Below 768px or under reduced motion all three
 * are shown static, with no pin.
 */
export function Principles() {
  const wrap = useRef<HTMLElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const mq = window.matchMedia(PIN_QUERY);
    let raf = 0;

    const apply = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      // 0 when the block pins, 1 just before it lets go (last 15% is a hold).
      const p = clamp01(-rect.top / (travel * 0.85));
      items.current.forEach((li, i) => {
        if (!li) return;
        const t = easeOut(clamp01(p * 3 - i));
        li.style.transform = `translateY(${(1 - t) * 60}vh)`;
        li.style.opacity = String(clamp01(t * 1.5));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () => {
      items.current.forEach((li) => {
        if (!li) return;
        li.style.transform = "";
        li.style.opacity = "";
      });
    };
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

  return (
    <section
      ref={wrap}
      aria-label="Principles"
      className="principles relative bg-neutral-100"
      data-pinned="false"
    >
      <Gridlines />
      <div className="principles-stage relative z-[1] flex flex-col justify-center overflow-hidden">
        <ul className="measure grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-8 lg:grid-cols-12">
          {pointOfView.principles.map((p, i) => (
            <li
              key={p.title}
              ref={(li) => void (items.current[i] = li)}
              className="col-span-full flex flex-col gap-4 border-t border-neutral-1000 bg-neutral-100 pt-6 md:col-span-4 lg:col-span-4"
            >
              <h3 className="text-heading-l text-neutral-1000">{p.title}</h3>
              <p className="text-body text-neutral-700">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
