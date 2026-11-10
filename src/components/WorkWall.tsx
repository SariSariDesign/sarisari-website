"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type Tile = {
  client: string;
  slug: string;
  src: string;
  /** Height / width, so columns stack like a masonry wall. */
  ratio: number;
  video?: string;
};

// Client imagery from /public/work. Each column scrolls; the middle one runs the other way.
const columns: Tile[][] = [
  [
    { client: "Kenchan", slug: "kenchan-ramen", src: "/work/kenchan-ramen.webp", ratio: 0.75 },
    { client: "Disco", slug: "disco", src: "/work/disco-cards.webp", ratio: 1.25 },
    { client: "Funding Solutions", slug: "funding-solutions", src: "/work/fs-app-history.webp", ratio: 0.72 },
    { client: "NutriSnap", slug: "nutrisnap", src: "/work/nutrisnap.webp", ratio: 1.17 },
  ],
  [
    { client: "Lendzi", slug: "lendzi", src: "/work/lendzi-cover.webp", ratio: 1.11, video: "/work/lendzi-cover.mp4" },
    { client: "Kenchan", slug: "kenchan-ramen", src: "/work/kenchan-add-to-bundle-mobile.webp", ratio: 0.67 },
    { client: "Funding Solutions", slug: "funding-solutions", src: "/work/fs-offers.webp", ratio: 1.22 },
    { client: "Disco", slug: "disco", src: "/work/disco-print.webp", ratio: 0.75 },
  ],
  [
    { client: "Disco", slug: "disco", src: "/work/disco-voice-poster.webp", ratio: 1.25, video: "/work/disco-voice.mp4" },
    { client: "Lendzi", slug: "lendzi", src: "/work/lendzi-dashboard.webp", ratio: 0.75 },
    { client: "Funding Solutions", slug: "funding-solutions", src: "/work/funding-solutions.webp", ratio: 0.75 },
    { client: "Disco", slug: "disco", src: "/work/disco-square.webp", ratio: 1 },
  ],
];

function TileCard({ t }: { t: Tile }) {
  return (
    <Link
      href={`/work/${t.slug}`}
      className="group relative block overflow-hidden rounded bg-neutral-300"
      style={{ aspectRatio: `1 / ${t.ratio}` }}
    >
      {t.video ? (
        <video
          src={t.video}
          poster={t.src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.src} alt={`${t.client} project`} loading="lazy" className="h-full w-full object-cover" />
      )}
      <span className="pointer-events-none absolute inset-0 rounded border border-transparent transition-colors duration-150 ease-out group-hover:border-neutral-1000" />
    </Link>
  );
}

// How far each column drifts (px) across one viewport of scroll. Quiet, per DESIGN.md Motion.
const DRIFT = [-48, 32, -24];

/** Wall of client work. Columns drift slightly, at different rates, as the page scrolls. */
export function WorkWall({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = Array.from(root.querySelectorAll<HTMLElement>("[data-col]"));
    let target = 0;
    let current = 0;
    let raf = 0;
    const onScroll = () => {
      const r = root.getBoundingClientRect();
      // 0 when the wall's top sits at the viewport top, 1 one viewport later.
      target = Math.max(-1, Math.min(1, -r.top / window.innerHeight));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      current += (target - current) * 0.1; // smoothed, like a scrubbed timeline
      cols.forEach((c, i) => (c.style.transform = `translate3d(0, ${(current * DRIFT[i]).toFixed(1)}px, 0)`));
      raf = Math.abs(target - current) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`relative grid grid-cols-2 gap-4 overflow-hidden md:grid-cols-3 ${className}`}>
      {columns.map((col, i) => (
        <div
          key={i}
          data-col
          className={`flex flex-col gap-4 will-change-transform ${i === 1 ? "pt-16" : ""} ${i === 2 ? "hidden pt-8 md:flex" : ""}`}
        >
          {col.map((t) => (
            <TileCard key={t.src} t={t} />
          ))}
        </div>
      ))}
    </div>
  );
}
