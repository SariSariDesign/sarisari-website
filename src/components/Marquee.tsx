"use client";

export type MarqueeLogo = { name: string; mark: string | null };

/**
 * Full-bleed logo marquee. Each half of the track repeats the logo set `repeat` times so
 * it is always wider than the viewport — the CSS `marquee` keyframe (translateX -50%)
 * then loops with no empty tail popping logos back in. Logos fade in one at a time on
 * load (staggered `--i` delay), hover pauses, reduced-motion disables both (globals.css).
 * Each logo is its mark + the name as a wordmark, rendered monotone so it doesn't compete.
 */
export function Marquee({
  items,
  speedSeconds = 40,
  repeat = 3,
  className = "",
}: {
  items: MarqueeLogo[];
  /** Seconds for one pass of the logo set. */
  speedSeconds?: number;
  /** Copies of the set per half; raise if a very wide viewport ever shows a gap. */
  repeat?: number;
  className?: string;
}) {
  const half = Array.from({ length: repeat }, () => items).flat();
  const strip = [...half, ...half];
  return (
    <div
      className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] ${className}`}
    >
      <div
        className="marquee-track items-center gap-16 pr-16"
        style={{ "--mqdur": `${speedSeconds * repeat}s` } as React.CSSProperties}
        aria-hidden
      >
        {strip.map((logo, i) => (
          <span
            key={i}
            className="marquee-logo flex shrink-0 items-center gap-3 grayscale"
            style={{ "--i": Math.min(i, 20) } as React.CSSProperties}
          >
            {logo.mark && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.mark} alt="" className="h-7 w-auto opacity-60" />
            )}
            <span className="whitespace-nowrap text-title-m font-medium text-neutral-700">
              {logo.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
