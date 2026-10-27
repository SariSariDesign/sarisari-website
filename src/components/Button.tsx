import Link from "next/link";

type Variant = "primary" | "secondary" | "white" | "ghost";
type Size = "large" | "medium";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Opens in a new tab with rel="noopener noreferrer" (used for offsite CTAs like Calendly). */
  external?: boolean;
  className?: string;
};

/**
 * DS button: sharp corners, Supply uppercase label + trailing arrow.
 * `ghost` is the text-only inline link ("View case study →").
 */
export function Button({
  href,
  children,
  variant = "primary",
  size = "large",
  external = false,
  className = "",
}: Props) {
  const base =
    "group ds-label inline-flex items-center gap-2 text-label-m transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300";
  const shape =
    variant === "ghost"
      ? ""
      : `${size === "large" ? "px-8 py-4" : "px-6 py-3"}`;
  const skin = {
    primary: "bg-primary-400 text-neutral-100 hover:bg-primary-500 active:bg-primary-600",
    secondary: "bg-primary-100 text-primary-400 hover:bg-primary-200",
    white: "bg-white text-primary-600 hover:bg-primary-100",
    ghost: "text-primary-400 hover:text-primary-500",
  }[variant];

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={href} className={`${base} ${shape} ${skin} ${className}`} {...externalProps}>
      {children}
      <Arrow />
    </Link>
  );
}

function Arrow() {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      aria-hidden
      className="line-icon nudge-x"
    >
      <path d="M10 1l7 7-7 7M17 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="square" pathLength={1} />
    </svg>
  );
}
