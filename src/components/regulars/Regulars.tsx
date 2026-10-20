"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { RegularCard } from "@/content/site";
import { Arrow } from "../Button";
import { HangHardware, RegularPhoto } from "./RegularPhoto";

const FLY_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

type Geo = { dx: number; dy: number; s: number; len: number; wobble: number };

/**
 * Our Regulars: four client prints that link to their case studies.
 *
 * Motion study: on desktop (motion allowed) each print starts out hanging on the hero's
 * shop wire (`HangingShop` slots) and, as the page scrolls toward this grid, its string
 * snaps and it falls — tumbling, growing — into its own grid cell, one after another.
 * The motion is a scroll-linked FLIP: measure slot vs. cell, then interpolate a
 * transform back to identity. Progress is eased with a light lerp so the drop settles
 * rather than tracking the wheel 1:1. Without JS, on mobile, or under reduced motion,
 * the grid is a plain static grid and the hero keeps its still illustration.
 */
export function Regulars({ items }: { items: RegularCard[] }) {
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const prints = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia(FLY_QUERY);
    let geo: Geo[] = [];
    let end = 1;
    let current = 0;
    let raf = 0;
    let active = false;

    const measure = () => {
      // Measure untransformed boxes: cells never move, slots are unrotated wrappers.
      geo = cells.current.map((cell, i) => {
        const slot = document.querySelector<HTMLElement>(`[data-hang-slot="${i}"]`);
        if (!cell || !slot) return { dx: 0, dy: 0, s: 1, len: 0, wobble: 0 };
        const a = slot.getBoundingClientRect();
        const b = cell.getBoundingClientRect();
        return {
          dx: a.left + a.width / 2 - (b.left + b.width / 2),
          dy: a.top - b.top,
          s: a.width / b.width,
          // Strings run from the panel top down to each print.
          len: slot.offsetTop,
          wobble: i % 2 ? 4 : -4,
        };
      });
      // Fully landed once the first row's top reaches 30% down the viewport.
      const first = cells.current[0];
      if (first) {
        const top = first.getBoundingClientRect().top + window.scrollY;
        end = Math.max(240, top - window.innerHeight * 0.3);
      }
    };

    const apply = (v: number) => {
      geo.forEach((g, i) => {
        const el = prints.current[i];
        const text = texts.current[i];
        if (!el) return;
        // Staggered: each print lets go a beat after the one before it.
        const t = clamp01((v - i * 0.07) / 0.79);
        const f = smooth(t);
        const rot = Math.sin(t * Math.PI) * g.wobble;
        const scale = g.s + (1 - g.s) * f;
        el.style.transform = `translate3d(${g.dx * (1 - f)}px, ${g.dy * (1 - f)}px, 0) rotate(${rot}deg) scale(${scale})`;
        el.style.setProperty("--len", `${g.len / g.s}px`);
        el.style.setProperty("--inv", String(1 / g.s));
        el.style.setProperty("--string", String(1 - clamp01(t / 0.04)));
        el.style.setProperty("--amp", String(1 - clamp01(t / 0.08)));
        // Upper prints stay in front of the ones hanging below them until they land.
        el.style.zIndex = t < 1 ? String(30 - i) : "";
        if (text) {
          const o = clamp01((t - 0.82) / 0.18);
          text.style.opacity = String(o);
          text.style.transform = `translateY(${(1 - o) * 12}px)`;
        }
      });
    };

    const tick = () => {
      const target = clamp01(window.scrollY / end);
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0005) current = target;
      apply(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const remeasure = () => {
      if (!active) return;
      measure();
      apply(current);
    };

    const reset = () => {
      delete root.dataset.hang;
      prints.current.forEach((el) => {
        if (!el) return;
        el.style.transform = "";
        el.style.zIndex = "";
      });
      texts.current.forEach((el) => {
        if (!el) return;
        el.style.opacity = "";
        el.style.transform = "";
      });
    };

    const ro = new ResizeObserver(remeasure);

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      active = mq.matches;
      if (!active) {
        window.removeEventListener("scroll", onScroll);
        ro.disconnect();
        reset();
        return;
      }
      root.dataset.hang = "fly";
      measure();
      current = clamp01(window.scrollY / end);
      apply(current);
      window.addEventListener("scroll", onScroll, { passive: true });
      ro.observe(document.body);
    };

    sync();
    mq.addEventListener("change", sync);
    document.fonts?.ready.then(remeasure);

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
      reset();
    };
  }, []);

  return (
    <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
      {items.map((r, i) => {
        const body = (
          <>
            <div ref={(el) => void (cells.current[i] = el)} className="relative aspect-[4/3]">
              <div
                ref={(el) => void (prints.current[i] = el)}
                className="regular-fly absolute inset-0 origin-top"
              >
                <div className="hang-sway relative transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  <HangHardware />
                  <RegularPhoto r={r} />
                </div>
              </div>
            </div>
            <div ref={(el) => void (texts.current[i] = el)} className="mt-6 flex flex-col gap-3">
              {r.types.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Project type">
                  {r.types.map((t) => (
                    <li
                      key={t}
                      className="ds-label rounded bg-yellow-200 px-3 py-1 text-label-s text-yellow-600"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="font-brand text-[clamp(32px,3.4vw,44px)] leading-[1.1] text-neutral-1000">
                {r.client}
              </h3>
              <p className="max-w-[46ch] text-body-m text-neutral-700">
                {r.impact ?? "Case study coming soon."}
              </p>
              {r.href && (
                <span className="ds-label inline-flex items-center gap-2 text-label-m text-primary-400 group-hover:text-primary-500">
                  View case study
                  <Arrow />
                </span>
              )}
            </div>
          </>
        );
        return r.href ? (
          <Link
            key={r.client}
            href={r.href}
            className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary-300"
          >
            {body}
          </Link>
        ) : (
          <div key={r.client}>{body}</div>
        );
      })}
    </div>
  );
}
