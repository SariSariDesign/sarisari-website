import { Gridlines } from "./Gridlines";

type SectionProps = {
  id?: string;
  className?: string;
  /** Overrides on the inner container (e.g. custom vertical padding). */
  containerClassName?: string;
  /** Turn off for the "moments" (statement panel etc.). */
  gridlines?: boolean;
  "aria-labelledby"?: string;
  children: React.ReactNode;
};

/** Full-bleed section: background/color via `className`, content on the 1200px measure (`.measure`). */
export function Section({
  id,
  className = "",
  containerClassName = "",
  gridlines = true,
  children,
  ...rest
}: SectionProps) {
  return (
    <section id={id} className={`relative ${className}`} {...rest}>
      {gridlines && <Gridlines />}
      <div className={`measure relative z-[1] py-24 ${containerClassName}`}>{children}</div>
    </section>
  );
}
