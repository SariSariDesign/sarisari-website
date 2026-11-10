/**
 * Blueprint crop marks: four 12px corner ticks 8px outside the parent's box (the parent
 * must be `relative`). The same device as the use-case spec-sheet plates on the homepage;
 * on case studies it frames quotes and figures instead of rules or borders.
 */
export function CropMarks({ tone = "ink" }: { tone?: "ink" | "primary" }) {
  const c = tone === "primary" ? "border-primary-400" : "border-neutral-1000";
  const base = `pointer-events-none absolute h-3 w-3 ${c}`;
  return (
    <>
      <span aria-hidden className={`${base} -left-2 -top-2 border-l border-t`} />
      <span aria-hidden className={`${base} -right-2 -top-2 border-r border-t`} />
      <span aria-hidden className={`${base} -bottom-2 -left-2 border-b border-l`} />
      <span aria-hidden className={`${base} -bottom-2 -right-2 border-b border-r`} />
    </>
  );
}
