// Phosphor icon shapes (phosphoricons.com, MIT) redrawn to the brand's line-icon spec:
// 2px monoline, square caps, draw once on enter (see `.line-icon` in globals.css).
const paths = {
  "arrows-clockwise": [
    "M21 12h6V6",
    "M27 12l-3.6-3.6A10 10 0 0 0 8.5 8.6",
    "M11 20H5v6",
    "M5 20l3.6 3.6A10 10 0 0 0 23.5 23.4",
  ],
  eye: ["M2 16s5-9 14-9 14 9 14 9-5 9-14 9S2 16 2 16Z", "M16 11a5 5 0 1 1 0 10a5 5 0 1 1 0-10Z"],
  "magnifying-glass": ["M14 5a9 9 0 1 1 0 18a9 9 0 1 1 0-18Z", "M20.5 20.5 27 27"],
  "shield-check": ["M6 7h20v9c0 9-10 12-10 12S6 25 6 16Z", "M11.5 16.5l3 3 6-6"],
} as const;

export type PhosphorName = keyof typeof paths;

export function PhosphorIcon({ name, size = 32, className = "" }: { name: PhosphorName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden className={`line-icon ${className}`}>
      {paths[name].map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="square" pathLength={1} />
      ))}
    </svg>
  );
}
