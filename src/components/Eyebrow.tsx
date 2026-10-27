/** Section eyebrow: orange accent dash + Space-Grotesk uppercase label (new comp header device). */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`ds-label flex items-center gap-3 text-label text-neutral-700 ${className}`}>
      <span aria-hidden className="h-0.5 w-6 shrink-0 bg-orange-400" />
      {children}
    </span>
  );
}
