import Link from "next/link";
import { caseStudyHref, getCaseStudy } from "@/content/case-studies";
import { Placeholder } from "./Placeholder";

type Tile = {
  slug: string;
  title: string;
  tags: string[];
  color: string;
  layout: "square" | "portrait" | "wide";
};

/** Grid placement + image frame per layout (12 cols desktop, 8 tablet, 1 col mobile). */
const LAYOUT = {
  // cols 1–6 · 1:1
  square: {
    cell: "col-span-4 md:col-span-4 lg:col-span-6",
    frame: "aspect-square",
  },
  // cols 7–12 · 4:5, dropped lower (~13vw, 80–200px) from tablet up
  portrait: {
    cell: "col-span-4 md:col-span-4 md:mt-[clamp(80px,13vw,200px)] lg:col-span-6",
    frame: "aspect-[4/5]",
  },
  // cols 3–12 · 16:9 (full width on tablet)
  wide: {
    cell: "col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-3",
    frame: "aspect-video",
  },
};

/**
 * "Freshly stocked" work tile. The client's brand color sits behind the image (not the
 * whole tile); below it, on the page background: client name (label), title
 * (heading-m, ~28ch) and project-type tags styled like price labels. The whole tile links
 * when the case study is published, with ↗ top-right of the image. Hover deepens the
 * image color; no zoom.
 */
export function WorkTile({ t }: { t: Tile }) {
  const study = getCaseStudy(t.slug);
  const href = study ? caseStudyHref(study) : null;
  const image = study?.card.image;
  const l = LAYOUT[t.layout];

  const body = (
    <>
      <div
        className={`work-frame relative flex items-center justify-center overflow-hidden p-[8%] ${l.frame}`}
        style={{ "--tile": t.color } as React.CSSProperties}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <Placeholder
            className="h-full w-full"
            label={`${study?.client ?? t.slug} — image pending`}
          />
        )}
        {href && (
          <span
            aria-hidden
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center bg-neutral-100 text-neutral-1000"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="line-icon nudge-ur"
            >
              <path
                d="M3 13L13 3M5 3h8v8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                pathLength={1}
              />
            </svg>
          </span>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <span className="ds-label text-label text-neutral-700">
          {study?.client}
        </span>
        <h3 className="max-w-[28ch] text-heading-m text-neutral-1000">
          {t.title}
        </h3>
        <ul className="mt-1 flex flex-wrap gap-2" aria-label="Project type">
          {t.tags.map((tag) => (
            <li
              key={tag}
              className="ds-label border border-neutral-1000 px-2 py-1 text-label text-neutral-1000"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <li className={l.cell}>
      {href ? (
        <Link
          href={href}
          aria-label={`${study?.client} case study`}
          className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-300"
        >
          {body}
        </Link>
      ) : (
        <div className="group">{body}</div>
      )}
    </li>
  );
}
