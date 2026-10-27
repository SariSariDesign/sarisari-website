import Link from "next/link";
import { type CaseStudy, caseStudyHref } from "@/content/case-studies";
import { Placeholder } from "./Placeholder";

/**
 * A case study as a big photo that is itself the link. Hover reveals a 1px ink border
 * (150ms ease-out) and nudges the ↗ icon 2px up-right; no zoom, lift or shadow. The
 * first card runs full width.
 */
export function CaseStudyCard({
  c,
  featured,
  headingLevel = "h3",
}: {
  c: CaseStudy;
  featured: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const href = caseStudyHref(c);
  const image = (featured && c.page?.heroImage) || c.card.image;
  const photo = (
    <div
      className={`relative overflow-hidden rounded border border-transparent transition-colors duration-150 ease-out group-hover:border-neutral-1000 group-focus-visible:border-neutral-1000 ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <Placeholder className="h-full w-full" label={`${c.client} — image pending`} />
      )}
      {href && (
        <span
          aria-hidden
          className="absolute right-4 top-4 flex h-12 w-12 rounded items-center justify-center bg-neutral-100 text-neutral-1000"
        >
          <ArrowUpRight />
        </span>
      )}
    </div>
  );
  return (
    <div className={featured ? "col-span-full" : "col-span-4 lg:col-span-6"}>
      {href ? (
        <Link
          href={href}
          aria-label={`${c.client} case study`}
          className="group block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300"
        >
          {photo}
        </Link>
      ) : (
        photo
      )}
      <div className="mt-6 flex flex-col gap-2">
        <H className="text-heading-m text-neutral-1000">
          {c.client}
        </H>
        <p className="max-w-[60ch] text-body text-neutral-700">
          {c.card.outcome ?? "Case study coming soon."}
        </p>
      </div>
    </div>
  );
}

/** ↗ line icon: 2px monoline, square caps; draws on reveal, nudges 2px up-right on hover. */
function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="line-icon nudge-ur">
      <path d="M3 13L13 3M5 3h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="square" pathLength={1} />
    </svg>
  );
}
