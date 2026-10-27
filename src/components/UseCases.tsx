"use client";

import { useEffect, useRef } from "react";
import { useCases, work } from "@/content/site";
import { HangHardware, RegularPhoto } from "./regulars/RegularPhoto";

const FLY_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const HIGHLIGHT_MS = 3500;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

type Geo = { dx: number; dy: number; s: number; len: number };

/**
 * "How can we help?": four problem cards, each pointing at one offer.
 *
 * Motion (desktop, motion allowed): the Disco, NutriSnap, Funding Solutions and Kenchan
 * prints start out hanging in the hero (`HangingShop` slots). As the page scrolls toward
 * this section they lose their clips and drop into cards 1–4, scroll-linked, ease-out, no
 * bounce. The other hero prints fade. Elsewhere (mobile, tablet, reduced motion, no JS)
 * the prints simply sit in the cards.
 *
 * The square down-arrow button scrolls to the matching pricing card and outlines it in
 * `primary-400` for ~3.5s.
 */
export function UseCases() {
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const prints = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia(FLY_QUERY);
    const flying = useCases.cards.map((c) => c.print);
    let geo: Geo[] = [];
    let end = 1;
    let current = 0;
    let raf = 0;
    let active = false;

    const others = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-hang-slot]"),
      ).filter((el) => !flying.includes(Number(el.dataset.hangSlot)));

    const measure = () => {
      geo = cells.current.map((cell, i) => {
        const slot = document.querySelector<HTMLElement>(
          `[data-hang-slot="${flying[i]}"]`,
        );
        if (!cell || !slot) return { dx: 0, dy: 0, s: 1, len: 0 };
        const a = slot.getBoundingClientRect();
        const b = cell.getBoundingClientRect();
        return {
          dx: a.left + a.width / 2 - (b.left + b.width / 2),
          dy: a.top - b.top,
          s: a.width / b.width,
          len: slot.offsetTop,
        };
      });
      // Fully landed once the cards' top reaches 30% down the viewport.
      const first = cells.current[0];
      if (first) {
        const top = first.getBoundingClientRect().top + window.scrollY;
        end = Math.max(240, top - window.innerHeight * 0.3);
      }
    };

    const apply = (v: number) => {
      geo.forEach((g, i) => {
        const el = prints.current[i];
        if (!el) return;
        // Each print lets go a beat after the one before it.
        const t = clamp01((v - i * 0.06) / 0.8);
        const f = easeOut(t);
        const scale = g.s + (1 - g.s) * f;
        el.style.transform = `translate3d(${g.dx * (1 - f)}px, ${g.dy * (1 - f)}px, 0) scale(${scale})`;
        el.style.setProperty("--len", `${g.len / g.s}px`);
        el.style.setProperty("--inv", String(1 / g.s));
        // Clips and strings go first, then the fall.
        el.style.setProperty("--string", String(1 - clamp01(t / 0.06)));
        el.style.zIndex = t < 1 ? String(30 - i) : "";
      });
      const fade = String(1 - clamp01(v / 0.35));
      others().forEach((el) => (el.style.opacity = fade));
    };

    const tick = () => {
      const target = clamp01(window.scrollY / end);
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.0005) current = target;
      apply(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const remeasure = () => {
      if (!active) return;
      // Measure untransformed positions.
      prints.current.forEach((el) => el && (el.style.transform = ""));
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
      others().forEach((el) => (el.style.opacity = ""));
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

  const highlight = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
    el.classList.remove("offer-highlight");
    void el.offsetWidth; // restart if clicked twice
    el.classList.add("offer-highlight");
    window.setTimeout(
      () => el.classList.remove("offer-highlight"),
      HIGHLIGHT_MS,
    );
  };

  return (
    <ul className="mt-12 grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12">
      {useCases.cards.map((c, i) => {
        const r = work.regulars[c.print];
        return (
          <li
            key={c.problem}
            className="usecase group col-span-4 flex flex-col rounded border border-neutral-300 bg-white transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-100 focus-within:border-neutral-1000 lg:col-span-3"
          >
            {/* Image on top: the print lands here, centered in a 4:3 frame. */}
            <div className="relative aspect-[4/3] rounded-t-[3px] bg-neutral-200">
              <div className="absolute inset-5 flex items-center justify-center [container-type:size]">
                <div
                  ref={(el) => void (cells.current[i] = el)}
                  className="relative"
                  style={{
                    aspectRatio: r.aspect,
                    width: `min(100cqw, 100cqh * ${ratio(r.aspect)})`,
                  }}
                >
                  <div
                    ref={(el) => void (prints.current[i] = el)}
                    className="regular-fly absolute inset-0 origin-top"
                  >
                    <div className="hang-sway relative">
                      <HangHardware />
                      <RegularPhoto r={r} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="text-heading-m text-neutral-1000">{c.problem}</h3>
              <p className="usecase-outcome text-body text-neutral-700">
                {c.outcome}
              </p>
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => highlight(c.offer.id)}
                  aria-label={`See ${c.offer.label} pricing`}
                  className="group/btn flex h-12 w-12 rounded items-center justify-center border border-neutral-1000 text-neutral-1000 transition-colors duration-150 ease-out hover:bg-neutral-1000 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                >
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                    aria-hidden
                    className="line-icon nudge-down"
                  >
                    <path
                      d="M8 1v15M1 9l7 7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                      pathLength={1}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const ratio = (aspect: string) => {
  const [w, h] = aspect.split("/").map(Number);
  return w / h;
};
