/**
 * Decorative dotted column grid — 7 vertical dotted lines / 6 columns, aligned to the
 * 1200px content measure. Pulled from the Sari-Sari DS comp (each section carries a
 * `gridlines` frame). Rendered inside `Section` so the grid runs the whole page; purely
 * visual, so it's hidden from the a11y tree and ignores pointer events (see `.gridlines`
 * in globals.css).
 */
export function Gridlines() {
  return (
    <div className="gridlines" aria-hidden>
      {Array.from({ length: 7 }).map((_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
