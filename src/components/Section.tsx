import { Gridlines } from "./Gridlines";

type SectionProps = {
  id?: string;
  className?: string;
  /** Overrides on the inner container. */
  containerClassName?: string;
  /** Turn off for the "moments" (statement panel etc.). */
  gridlines?: boolean;
  /** No min-height; generous padding instead (80–160px top/bottom). */
  hug?: boolean;
  "aria-labelledby"?: string;
  children: React.ReactNode;
};

/**
 * Full-bleed section: background/color via `className`, content on the measure. By default
 * it fills the screen below the nav with content vertically centered, and scrolling
 * settles at its start (see `.section-full` / scroll snap in globals.css).
 */
export function Section({
  id,
  className = "",
  containerClassName = "",
  gridlines = true,
  hug = false,
  children,
  ...rest
}: SectionProps) {
  return (
    <section id={id} className={`relative ${hug ? "section-hug" : "section-full"} ${className}`} {...rest}>
      {gridlines && <Gridlines />}
      <div className={`measure relative z-[1] ${containerClassName}`}>{children}</div>
    </section>
  );
}
