type Props = {
  className?: string;
  label?: string;
  /** Default `hatch` = the comp's diagonal-hatch image stand-in; solid tones for legacy use. */
  tone?: "hatch" | "neutral" | "blue" | "green";
  rounded?: boolean;
};

/** Image placeholder — diagonal-hatch stand-in with a centered label, swapped for real assets later. */
export function Placeholder({ className = "", label, tone = "hatch", rounded = true }: Props) {
  const solid = {
    neutral: "bg-neutral-600",
    blue: "bg-primary-500",
    green: "bg-success-500",
  };
  const isHatch = tone === "hatch";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        rounded ? "rounded" : ""
      } ${isHatch ? "" : solid[tone]} ${className}`}
      role="img"
      aria-label={label ?? "Image coming soon"}
      style={
        isHatch
          ? {
              // DS greys (grey-200 / grey-300) as the diagonal-hatch stand-in stripes.
              backgroundImage:
                "repeating-linear-gradient(-45deg, var(--color-grey-200), var(--color-grey-200) 12px, var(--color-grey-300) 12px, var(--color-grey-300) 13px)",
            }
          : undefined
      }
    >
      {label && (
        <span
          className={`ds-label px-4 text-center text-label ${
            isHatch ? "text-neutral-700" : "text-neutral-100/60"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
