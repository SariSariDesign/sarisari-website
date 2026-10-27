import Link from "next/link";
import { type CaseStudy, caseStudyHref } from "@/content/case-studies";
import { Placeholder } from "./Placeholder";

/**
 * A case study as a big photo that is itself the link (Friendly-style): hovering zooms
 * the photo and raises a "go to page" badge at its foot. The first card runs full width.
 */
export function CaseStudyCard({ c, featured }: { c: CaseStudy; featured: boolean }) {
  const href = caseStudyHref(c);
  const image = (featured && c.page?.heroImage) || c.card.image;
  const photo = (
    <div
      className={`relative overflow-hidden rounded-2xl ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <Placeholder className="h-full w-full" label={`${c.client} — image pending`} />
      )}
      {href && (
        <span
          aria-hidden
          className="absolute bottom-5 left-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-neutral-100 text-neutral-1000 opacity-0 shadow-[0_8px_20px_-10px_rgba(31,29,28,0.5)] transition-[opacity,translate] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 12L12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      )}
    </div>
  );
  return (
    <div className={featured ? "md:col-span-2" : ""}>
      {href ? (
        <Link
          href={href}
          aria-label={`${c.client} case study`}
          className="group block cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300"
        >
          {photo}
        </Link>
      ) : (
        photo
      )}
      <div className="mt-6 flex flex-col gap-2">
        <h3 className="font-brand text-[clamp(30px,2.6vw,40px)] leading-[1.1] text-neutral-1000">
          {c.client}
        </h3>
        <p className="max-w-[60ch] text-body-m text-neutral-700">
          {c.card.outcome ?? "Case study coming soon."}
        </p>
      </div>
    </div>
  );
}
