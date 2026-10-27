"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { caseStudyHref, getCaseStudy } from "@/content/case-studies";
import type { PortfolioPiece } from "@/content/site";
import { HangHardware, RegularPhoto } from "./RegularPhoto";

const FLY_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

type Geo = { dx: number; dy: number; s: number; len: number; wobble: number };

/**
 * Our Regulars: the gallery wall of client work right under the hero, the visual hook
 * before Services. Pieces with a published case study link to it.
 *
 * Motion study: on desktop (motion allowed) each print starts out hanging on the hero's
 * shop wire (`HangingShop` slots) and, as the page scrolls toward this grid, its string
 * snaps and it falls — tumbling, growing — into its own grid cell, one after another.
 * The motion is a scroll-linked FLIP: measure slot vs. cell, then interpolate a
 * transform back to identity. Progress is eased with a light lerp so the drop settles
 * rather than tracking the wheel 1:1. Without JS, on mobile, or under reduced motion,
 * the grid is a plain static grid and the hero keeps its still illustration.
 */
export function Regulars({ items }: { items: PortfolioPiece[] }) {
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
        const t = clamp01((v - i * 0.05) / 0.75);
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

  const cellRef = (i: number) => (el: HTMLDivElement | null) => void (cells.current[i] = el);
  const printRef = (i: number) => (el: HTMLDivElement | null) => void (prints.current[i] = el);
  const textRef = (i: number) => (el: HTMLDivElement | null) => void (texts.current[i] = el);

  const piece = (r: PortfolioPiece, i: number) => {
    const study = r.caseStudy ? getCaseStudy(r.caseStudy) : undefined;
    const href = study ? caseStudyHref(study) : null;
    const body = (
      <>
        <div ref={cellRef(i)} className="relative" style={{ aspectRatio: r.aspect }}>
          <div ref={printRef(i)} className="regular-fly absolute inset-0 origin-top">
            <div className="hang-sway relative">
              <HangHardware />
              <RegularPhoto r={r} />
            </div>
          </div>
        </div>
        <div ref={textRef(i)}>
          <p className="ds-label mt-3 text-label-s text-neutral-700">{r.client}</p>
        </div>
      </>
    );
    return (
      <li
        key={r.client}
        className="wall-item min-w-0"
        style={{ "--a": aspect(r.aspect) } as React.CSSProperties}
      >
        {href ? (
          <Link
            href={href}
            aria-label={`${r.client} case study`}
            className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300"
          >
            {body}
          </Link>
        ) : (
          body
        )}
      </li>
    );
  };

  // Two justified rows (equal heights at rest); index order matches the hero cluster, so
  // prints fall straight down. Hovering a piece grows it while its row-mates give way.
  const rows = [items.slice(0, 3), items.slice(3)];
  return (
    <div className="wall mt-12 flex flex-col gap-3 md:gap-4">
      {rows.map((row, r) => (
        <ul key={r} className="wall-row flex items-center gap-3 md:gap-4">
          {row.map((p, k) => piece(p, r * 3 + k))}
        </ul>
      ))}
    </div>
  );
}

const aspect = (ratio: string) => {
  const [w, h] = ratio.split("/").map(Number);
  return w / h;
};
