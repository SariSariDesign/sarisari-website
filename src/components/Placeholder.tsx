type Props = {
  className?: string;
  /** token-colored fill, defaults to the comp's neutral-600 placeholder grey */
  tone?: "neutral" | "blue" | "green";
  label?: string;
};

/** Image placeholder matching the comp's grey blocks; swapped for real assets later. */
export function Placeholder({ className = "", tone = "neutral", label }: Props) {
  const bg = {
    neutral: "bg-neutral-600",
    blue: "bg-primary-500",
    green: "bg-success-500",
  }[tone];
  return (
    <div className={`relative ${bg} ${className}`} role="img" aria-label={label ?? "Image coming soon"}>
      {label && (
        <span className="ds-label absolute bottom-2 left-2 text-label-s text-neutral-100/60">{label}</span>
      )}
    </div>
  );
}
