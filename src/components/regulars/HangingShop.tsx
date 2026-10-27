import { useCases, work } from "@/content/site";

/** Slots whose print drops into a use-case card on scroll. */
const FLIES = useCases.cards.map((c) => c.print);
import { HangHardware, RegularPhoto } from "./RegularPhoto";

/**
 * Where each piece hangs, in units of the panel width (cqw) so the clutter keeps its
 * shape at any size: left edge, top (= string length), and print width. Case studies
 * (0–2) hang across the front left to right, matching their row below; references (3–5)
 * crowd in behind and between them, left to right like the gallery wall they fall to.
 */
const HANG = [
  // Spread down the column in a zigzag so the cluster fills the hero's height.
  { left: 0, top: 6, width: 46, delay: "0ms" }, // Kenchan 4/3
  { left: 50, top: 18, width: 46, delay: "60ms" }, // Funding Solutions 4/3
  { left: 4, top: 50, width: 44, delay: "120ms" }, // Disco 4/3
  { left: 54, top: 62, width: 42, delay: "40ms" }, // Lendzi 3/2
  { left: 26, top: 80, width: 34, delay: "100ms" }, // NutriSnap 6/7
  { left: 66, top: 96, width: 30, delay: "160ms" }, // sixth piece 1/1
];

/** Height of the hanging cluster (deepest string + print), in cqw, for vertical centering. */
const CLUSTER_H = Math.max(...HANG.map((h, i) => h.top + h.width * aspectRatio(i)));

function aspectRatio(i: number) {
  const [w, h] = work.regulars[i].aspect.split("/").map(Number);
  return h / w;
}

/**
 * Hero: six client prints hanging straight on strings that fade out as they rise,
 * settling once on load and crowding each other like stock in a sari-sari store window. On
 * desktop with motion allowed, the four use-case prints are only measuring slots:
 * `UseCases` hides them (`[data-hang=fly]`) and drops the real prints from these spots
 * into its cards as the page scrolls; the rest fade. Elsewhere they stay a still picture.
 */
export function HangingShop() {
  return (
    <div
      className="relative w-full [container-type:inline-size]"
      aria-hidden
    >
      {/* Height follows the cluster so prints keep their size; strings fade out above. */}
      <div className="relative w-full" style={{ height: `${CLUSTER_H}cqw` }}>
        {work.regulars.map((r, i) => {
          const h = HANG[i % HANG.length];
          return (
            <div
              key={r.client}
              data-hang-slot={i}
              data-flies={FLIES.includes(i) ? "" : undefined}
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
