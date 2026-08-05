"use client";

/**
 * Logo marquee. The strip is duplicated so the CSS `marquee` keyframe (translateX -50%)
 * loops seamlessly; hover pauses it and reduced-motion disables it (see globals.css).
 * Edge fade via a horizontal mask.
 */
export function Marquee({
  items,
  speedSeconds = 40,
  className = "",
}: {
  items: string[];
  speedSeconds?: number;
  className?: string;
}) {
  const strip = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}
    >
      <div
        className="marquee-track gap-16 pr-16"
        style={{ "--mqdur": `${speedSeconds}s` } as React.CSSProperties}
        aria-hidden
      >
        {strip.map((name, i) => (
          <span key={i} className="ds-label whitespace-nowrap text-label-m text-neutral-700">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
