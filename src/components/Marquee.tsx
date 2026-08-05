"use client";

export type MarqueeLogo = { name: string; mark: string | null };

/**
 * Logo marquee. The strip is duplicated so the CSS `marquee` keyframe (translateX -50%)
 * loops seamlessly; hover pauses it and reduced-motion disables it (see globals.css).
 * Each logo renders its grey silhouette mark (or the name as text when `mark` is null).
 * Edge fade via a horizontal mask.
 */
export function Marquee({
  items,
  speedSeconds = 40,
  className = "",
}: {
  items: MarqueeLogo[];
  speedSeconds?: number;
  className?: string;
}) {
  const strip = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}
    >
      <div
        className="marquee-track items-center gap-16 pr-16"
        style={{ "--mqdur": `${speedSeconds}s` } as React.CSSProperties}
        aria-hidden
      >
        {strip.map((logo, i) =>
          logo.mark ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={logo.mark}
              alt={logo.name}
              className="h-6 w-auto shrink-0 opacity-60"
            />
          ) : (
            <span
              key={i}
              className="ds-label whitespace-nowrap text-label-m text-neutral-700"
            >
              {logo.name}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
