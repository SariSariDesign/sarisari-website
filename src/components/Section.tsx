type SectionProps = {
  id?: string;
  className?: string;
  /** Overrides on the inner 1200px container (e.g. custom vertical padding). */
  containerClassName?: string;
  "aria-labelledby"?: string;
  children: React.ReactNode;
};

/** Full-bleed section: background/color via `className`, content centered to the 1200px measure. */
export function Section({
  id,
  className = "",
  containerClassName = "",
  children,
  ...rest
}: SectionProps) {
  return (
    <section id={id} className={`relative ${className}`} {...rest}>
      <div className={`mx-auto max-w-[1200px] px-6 py-24 md:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
