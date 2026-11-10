"use client";

import Link from "next/link";
import { useRef } from "react";

type Slide = { slug: string; client: string; src: string; video?: string };

// Wide client shots from /public/work, shown as a row that runs off the right edge.
const slides: Slide[] = [
  { slug: "kenchan-ramen", client: "Kenchan", src: "/work/kenchan-cover.webp" },
  { slug: "disco", client: "Disco", src: "/work/disco-onboarding-poster.webp", video: "/work/disco-onboarding.mp4" },
  { slug: "funding-solutions", client: "Funding Solutions", src: "/work/funding-solutions-hero.webp" },
  { slug: "lendzi", client: "Lendzi", src: "/work/lendzi-brand.webp" },
  { slug: "disco", client: "Disco", src: "/work/disco-user-flow.webp" },
  { slug: "funding-solutions", client: "Funding Solutions", src: "/work/fs-design-system.webp" },
  { slug: "kenchan-ramen", client: "Kenchan", src: "/work/kenchan-schema.webp" },
];

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={dir === "left" ? "rotate-180" : ""}>
      <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function WorkCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 480) + 16), behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Starts on the content edge, bleeds off the right of the viewport. */}
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: "max(16px, calc((100vw - 1200px) / 2 + 8px))", scrollPaddingLeft: "max(16px, calc((100vw - 1200px) / 2 + 8px))" }}
      >
        {slides.map((s, i) => (
          <Link
            key={s.src}
            href={`/work/${s.slug}`}
            data-slide
            className="group relative block aspect-[16/11] w-[82vw] shrink-0 snap-start overflow-hidden rounded border border-neutral-300 bg-neutral-200 transition-colors duration-150 ease-out hover:border-neutral-1000 md:w-[46vw] lg:w-[480px]"
            aria-label={`${s.client} case study`}
          >
            {s.video ? (
              <video src={s.video} poster={s.src} autoPlay muted loop playsInline preload="none" className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.src} alt="" loading={i < 3 ? "eager" : "lazy"} className="h-full w-full object-cover" />
            )}
          </Link>
        ))}
        <div className="w-4 shrink-0" aria-hidden />
      </div>
      <div className="measure flex justify-end gap-2">
        <button type="button" onClick={() => step(-1)} aria-label="Previous project" className="grid h-11 w-11 place-items-center rounded border border-neutral-300 text-neutral-1000 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-200">
          <ArrowIcon dir="left" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next project" className="grid h-11 w-11 place-items-center rounded border border-neutral-300 text-neutral-1000 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-200">
          <ArrowIcon dir="right" />
        </button>
      </div>
    </div>
  );
}
