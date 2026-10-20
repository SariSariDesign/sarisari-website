import { work } from "@/content/site";
import { HangHardware, RegularPhoto } from "./RegularPhoto";

/**
 * Where each print hangs, in units of the panel width (cqw), so the cluster keeps its
 * shape at any size. Laid out as a loose 2×2 that mirrors the Our Regulars grid
 * (0 top-left, 1 top-right, 2 bottom-left, 3 bottom-right), so every print falls
 * straight down into its own cell without crossing another.
 */
const HANG = [
  { left: 12, top: 8, sway: "3.4s" },
  { left: 46, top: 12.5, sway: "2.9s" },
  { left: 18, top: 26, sway: "3.7s" },
  { left: 52, top: 30.5, sway: "3.1s" },
];

/**
 * Hero: four client prints hanging straight on strings that fade out as they rise,
 * swaying gently and overlapping like snapshots pinned up in a shop window. On desktop
 * with motion allowed, these are only measuring slots: `Regulars` hides them
 * (`[data-hang=fly]`) and drops the real Our Regulars prints from exactly these spots
 * into the grid as the page scrolls. Elsewhere (mobile, reduced motion, no JS) they
 * render as a still illustration.
 */
export function HangingShop() {
  return (
    <div
      className="relative aspect-[16/9] w-full [container-type:inline-size] lg:aspect-auto lg:h-full"
      aria-hidden
    >
      {work.regulars.map((r, i) => {
        const h = HANG[i % HANG.length];
        return (
          <div
            key={r.client}
            data-hang-slot={i}
            className="hang-static absolute w-[30cqw]"
            style={{ left: `${h.left}cqw`, top: `${h.top}cqw`, zIndex: HANG.length - i }}
          >
            <div
              className="hang-sway relative"
              style={
                { "--len": `${h.top}cqw`, animationDuration: h.sway } as React.CSSProperties
              }
            >
              <HangHardware />
              <RegularPhoto r={r} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
