import type { PortfolioPiece } from "@/content/site";
import { Placeholder } from "../Placeholder";

/**
 * A client-work print: the photo, unframed, like a snapshot pinned up in a shop window.
 * Shared by the hero's hanging line and the Our Recent Clients gallery so the two read as
 * the same object while it falls from one to the other. Radius and caption are
 * proportional (%, cqw) so the print looks identical at any scale.
 */
export function RegularPhoto({ r }: { r: Pick<PortfolioPiece, "client" | "image" | "aspect"> }) {
  return (
    <div
      className="regular-print relative w-full overflow-hidden rounded bg-neutral-200 shadow-[0_10px_28px_-14px_rgba(31,29,28,0.45)] [container-type:inline-size]"
      style={{ aspectRatio: r.aspect }}
    >
      {r.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="relative h-full w-full">
          <Placeholder className="h-full w-full" rounded={false} />
          <span className="ds-label absolute inset-0 flex items-center justify-center text-center text-[2.6cqw] tracking-[0.2em] text-neutral-700">
            {r.client} — photo pending
          </span>
        </div>
      )}
    </div>
  );
}

/** The string up to the wire and the clothespin holding the print. Height via `--len`. */
export function HangHardware() {
  return (
    <>
      <span className="hang-string" aria-hidden />
      <span className="hang-pin" aria-hidden />
    </>
  );
}
