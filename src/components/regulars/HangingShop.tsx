import { work } from "@/content/site";
import { HangHardware, RegularPhoto } from "./RegularPhoto";

/**
 * Where each piece hangs, in units of the panel width (cqw) so the clutter keeps its
 * shape at any size: left edge, top (= string length), and print width. Case studies
 * (0–2) hang across the front left to right, matching their row below; references (3–5)
 * crowd in behind and between them, left to right like the gallery wall they fall to.
 */
const HANG = [
  { left: 4, top: 9, width: 29, delay: "0ms" },
  { left: 35, top: 3, width: 27, delay: "60ms" },
  { left: 64, top: 12, width: 30, delay: "120ms" },
  { left: 13, top: 29, width: 24, delay: "40ms" },
  { left: 40, top: 23, width: 19, delay: "100ms" },
  { left: 61, top: 33, width: 17, delay: "160ms" },
];

/** Height of the hanging cluster (deepest string + print), in cqw, for vertical centering. */
const CLUSTER_H = Math.max(...HANG.map((h, i) => h.top + h.width * aspectRatio(i)));

function aspectRatio(i: number) {
  const [w, h] = work.regulars[i].aspect.split("/").map(Number);
  return h / w;
}

/**
 * Hero: six client prints hanging straight on strings that fade out as they rise,
 * settling once on load and crowding each other like stock in a sari-sari store window. On desktop
 * with motion allowed, these are only measuring slots: `Regulars` hides them
 * (`[data-hang=fly]`) and drops the real Our Regulars prints from exactly these spots
 * into the grid as the page scrolls. Elsewhere (mobile, reduced motion, no JS) they
 * render as a still illustration.
 */
export function HangingShop() {
  return (
    <div
      className="relative aspect-[100/58] w-full [container-type:inline-size] lg:aspect-auto lg:h-full"
      aria-hidden
    >
      {/* The cluster is centered vertically; strings keep their lengths (fading out above). */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{ height: `${CLUSTER_H}cqw` }}
      >
        {work.regulars.map((r, i) => {
          const h = HANG[i % HANG.length];
          return (
            <div
              key={r.client}
              data-hang-slot={i}
              className="hang-static absolute"
              style={{
                left: `${h.left}cqw`,
                top: `${h.top}cqw`,
                width: `${h.width}cqw`,
                // Case studies hang in front; references peek out from behind.
                zIndex: HANG.length - i,
              }}
            >
              <div
                className="hang-sway relative"
                style={{ "--len": `${h.top}cqw`, animationDelay: h.delay } as React.CSSProperties}
              >
                <HangHardware />
                <RegularPhoto r={r} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
