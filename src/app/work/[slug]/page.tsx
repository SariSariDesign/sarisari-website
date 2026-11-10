import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/Eyebrow";
import { FooterCta } from "@/components/FooterCta";
import { CropMarks } from "@/components/CropMarks";
import { Gridlines } from "@/components/Gridlines";
import { Nav } from "@/components/Nav";
import { Placeholder } from "@/components/Placeholder";
import { Reveal } from "@/components/Reveal";
import { TickNav } from "@/components/TickNav";
import { WorkTile } from "@/components/WorkTile";
import { caseStudiesSection } from "@/content/site";
import {
  type CaseStudy,
  type CaseStudyBlock,
  getCaseStudy,
  publishedCaseStudies,
} from "@/content/case-studies";
import { pageMetadata } from "@/lib/metadata";

type Params = { slug: string };
type Page = NonNullable<CaseStudy["page"]>;
type Chapter = { id: string; label: string | null; blocks: CaseStudyBlock[] };

/** Only published case studies get a page; coming-soon slugs 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return publishedCaseStudies.map((c) => ({ slug: c.slug }));
}

const load = (slug: string) => {
  const study = getCaseStudy(slug);
  return study?.status === "published" && study.page ? study : null;
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const study = load(slug);
  return study?.page
    ? pageMetadata({ title: study.page.title, description: study.page.intro, path: `/work/${slug}` })
    : {};
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Splits the blocks into chapters: every block with a `label` opens a new one. */
function toChapters(blocks: CaseStudyBlock[]): Chapter[] {
  const chapters: Chapter[] = [];
  for (const block of blocks) {
    const label = block.kind === "section" || block.kind === "split" ? (block.label ?? null) : null;
    if (label || chapters.length === 0) {
      const id = `ch-${slugify(label ?? "story")}`;
      chapters.push({ id, label, blocks: [] });
    }
    chapters[chapters.length - 1].blocks.push(block);
  }
  return chapters;
}

/**
 * Case-study template: renders any published entry in `src/content/case-studies` on the
 * homepage system — 12/8/4-column measure, gridlines in every section, left-edge tick
 * nav, "stock the shelf" reveals. Each chapter is asymmetric on desktop: a sticky label
 * rail on columns 1–3, copy on columns 4–11, figures running on to column 12.
 */
export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const study = load((await params).slug);
  if (!study?.page) notFound();
  const page = study.page;
  // Callouts (e.g. Key takeaways) render in the overview, after the stats.
  const callouts = page.blocks.filter((b) => b.kind === "callout");
  const chapters = toChapters(page.blocks.filter((b) => b.kind !== "callout"));
  const ticks = [
    { id: "overview", label: "Overview" },
    ...chapters.filter((c) => c.label).map((c) => ({ id: c.id, label: c.label as string })),
  ];

  return (
    <>
      <Nav />
      <main className="bg-neutral-100">
        <Overview study={study} page={page} callouts={callouts} />
        {chapters.map((c, i) => (
          <ChapterSection key={c.id} chapter={c} index={i} />
        ))}
        <MoreWork current={study.slug} />
      </main>
      <FooterCta content={page.cta} />
      <TickNav sections={ticks} />
    </>
  );
}

function Overview({
  study,
  page,
  callouts,
}: {
  study: CaseStudy;
  page: Page;
  callouts: CaseStudyBlock[];
}) {
  // "Client: Kenchan Ramen · Partner: Kocah" → [["Client", "Kenchan Ramen"], ["Partner", "Kocah"]]
  const credits = page.byline.split(" · ").map((part) => {
    const i = part.indexOf(":");
    return i > 0 ? [part.slice(0, i).trim(), part.slice(i + 1).trim()] : ["", part.trim()];
  });
  return (
    <section id="overview" data-hero aria-labelledby="cs-title" className="relative">
      <Gridlines />
      <div className="measure relative z-[1] pb-20 pt-12 md:pt-16 lg:pb-32 lg:pt-24">
        {/* Load sequence, as on the homepage hero: eyebrow 0ms, headline +80ms, intro +180ms. */}
        <div className="hero-seq flex flex-col gap-6">
          <Eyebrow>{["Case study", study.card.productType].filter(Boolean).join(" · ")}</Eyebrow>
          <h1
            id="cs-title"
            className="text-pretty font-brand text-display-m text-neutral-1000"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {page.title}
          </h1>
          <p className="cols-8 text-lead text-neutral-700" style={{ "--d": "180ms" } as React.CSSProperties}>
            {page.intro}
          </p>
        </div>

        <Reveal delay={280} className="mt-12 lg:mt-16">
          {page.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.heroImage}
              alt=""
              className="w-full rounded object-cover"
              style={{ aspectRatio: (page.heroRatio ?? "16x9").replace("x", "/") }}
            />
          ) : (
            <Placeholder className="aspect-video w-full" label="Hero image — asset pending" />
          )}
        </Reveal>

        {/* Meta on c1–c3; headline stats on the body column c4–c12. */}
        <div className="mt-12 grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-8 lg:mt-20 lg:grid-cols-12">
          <Reveal className="col-span-full md:col-span-3">
            <dl className="flex flex-col gap-6">
              {credits.map(([k, v]) => (
                <div key={k + v} className="flex flex-col gap-1">
                  {k && <dt className="ds-label text-label text-neutral-700">{k}</dt>}
                  <dd className="text-body-s text-neutral-1000">{v}</dd>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <dt className="ds-label text-label text-neutral-700">Services</dt>
                {page.tags.map((t) => (
                  <dd key={t} className="text-body-s text-neutral-1000">
                    {t}
                  </dd>
                ))}
              </div>
            </dl>
          </Reveal>
          <Reveal
            as="ul"
            stagger
            className="col-span-full grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3 md:col-span-5 lg:col-span-9 lg:col-start-4"
          >
            {page.heroStats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </Reveal>
          {callouts.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      </div>
    </section>
  );
}

/*
 * Placement on the 12-column grid (desktop). Below 1024px everything runs full width.
 *   BODY  c4–c12  copy, steps, stats, `span: "body"` media
 *   OFFSET c1–c6  quotes (default), offset left against the body column
 *   FULL  c1–c12  `span: "full"` media and quotes
 */
const BODY = "col-span-full lg:col-span-9 lg:col-start-4";
const OFFSET = "col-span-full md:col-span-6 lg:col-span-6 lg:col-start-1";
const FULL = "col-span-full";

/** Chapter: eyebrow + blocks on one 12-col grid. The tick nav carries navigation, so no rail. */
function ChapterSection({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <section
      id={chapter.id}
      aria-label={chapter.label ?? undefined}
      className="relative py-16 lg:py-24"
    >
      <Gridlines />
      <div className="measure relative z-[1] grid grid-cols-4 gap-x-4 gap-y-14 md:grid-cols-8 lg:grid-cols-12 lg:gap-y-20">
        {chapter.blocks.map((block, i) => (
          <Block
            key={i}
            block={block}
            eyebrow={
              i === 0 && chapter.label ? (
                <Eyebrow className="mb-2 lg:mb-4">
                  <span className="text-primary-400">{String(index + 1).padStart(2, "0")}</span>
                  {chapter.label}
                </Eyebrow>
              ) : null
            }
          />
        ))}
      </div>
    </section>
  );
}

/** `eyebrow`: the chapter label, set above the chapter's first block in that block's column. */
function Block({ block, eyebrow }: { block: CaseStudyBlock; eyebrow?: React.ReactNode }) {
  switch (block.kind) {
    case "section":
      return (
        <Reveal className={`${BODY} flex flex-col gap-5`}>
          {eyebrow}
          <h2 className="text-pretty font-brand text-heading-m text-neutral-1000">{block.title}</h2>
          <Paragraphs paragraphs={block.paragraphs} />
        </Reveal>
      );
    case "step":
      return (
        <Reveal className={`${BODY} flex flex-col gap-2`}>
          {eyebrow}
          <h3 className="text-lead text-primary-400">{block.title}</h3>
          <Paragraphs paragraphs={block.paragraphs} />
        </Reveal>
      );
    case "compare":
      return (
        <Reveal stagger className={`${BODY} grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2`}>
          {block.items.map((it) => (
            <div key={it.title} className="flex flex-col gap-2">
              <h3 className="text-lead text-primary-400">{it.title}</h3>
              <p className="text-lead text-neutral-700">{it.text}</p>
            </div>
          ))}
        </Reveal>
      );
    case "split":
      // Statement left (c1–c5), copy right (c7–c12): the one block that breaks the body column.
      return (
        <Reveal className={`${FULL} grid grid-cols-1 gap-x-4 gap-y-5 lg:grid-cols-12`}>
          {eyebrow && <div className="lg:col-span-12">{eyebrow}</div>}
          <h2 className="text-pretty font-brand text-heading-m text-neutral-1000 lg:col-span-5">
            {block.title}
          </h2>
          <div className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
            <Paragraphs paragraphs={block.paragraphs} />
          </div>
        </Reveal>
      );
    case "quote": {
      const span = block.span ?? "offset";
      const place = span === "full" ? FULL : span === "body" ? BODY : OFFSET;
      // Crop-marked plate; the open quote hangs in the left margin so the text edge stays on the grid.
      return (
        <Reveal className={place}>
          {eyebrow}
          <div className="relative">
            <CropMarks />
            <figure className="flex flex-col gap-6 bg-neutral-200 px-6 py-8 md:px-10 md:py-12">
              <blockquote className="relative text-pretty font-brand text-heading-m italic text-neutral-1000">
                <span aria-hidden className="absolute -left-[0.5em] text-primary-400">
                  “
                </span>
                {block.quote.replace(/^[“"]|[”"]$/g, "")}”
              </blockquote>
              <figcaption className="flex flex-col gap-1">
                <span className="ds-label text-label text-neutral-1000">{block.name}</span>
                <span className="text-body-s text-neutral-700">{block.role}</span>
              </figcaption>
            </figure>
          </div>
        </Reveal>
      );
    }
    case "stats":
      // Value over label, three across on the gridline columns; no rules.
      return (
        <Reveal
          as="ul"
          stagger
          className={`${BODY} grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3`}
        >
          {block.stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </Reveal>
      );
    case "figure":
      return (
        <Reveal className={(block.span ?? "body") === "full" ? FULL : BODY}>
          <Figure ratio={block.ratio} caption={block.caption} image={block.image} video={block.video} />
        </Reveal>
      );
    case "figure-row":
      return (
        <Reveal
          stagger
          className={`${(block.span ?? "full") === "full" ? FULL : BODY} flex flex-col gap-8 sm:flex-row sm:items-start`}
        >
          {block.figures.map((f) => (
            <Figure key={f.caption} ratio={f.ratio} caption={f.caption} image={f.image} video={f.video} grow />
          ))}
        </Reveal>
      );
    case "callout":
      return (
        <Reveal className={BODY}>
          {eyebrow}
          <aside className="relative flex flex-col gap-6 bg-neutral-200 px-6 py-8 md:px-10 md:py-10">
            <CropMarks />
            <h2 className="ds-label text-label text-primary-400">{block.title}</h2>
            <ul className="flex flex-col gap-4">
              {block.items.map((it) => (
                <li key={it.lead} className="text-body text-neutral-700">
                  <span className="text-neutral-1000">{it.lead}</span> {it.text}
                </li>
              ))}
            </ul>
          </aside>
        </Reveal>
      );
    default:
      return null;
  }
}

/** One stat style everywhere: display-s value over a label. */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <li className="flex flex-col gap-2">
      <span className="font-brand text-display-s text-neutral-1000">{value}</span>
      <span className="ds-label text-label text-neutral-700">{label}</span>
    </li>
  );
}

/** Body copy at `lead` size: ~74 characters a line across c4–c12 at desktop. */
function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 32)} className="whitespace-pre-line text-lead text-neutral-700">
          {p}
        </p>
      ))}
    </>
  );
}

/** "Fig 01 — Caption" → label "Fig 01" + caption; captions without a dash show as-is. */
function Figure({
  ratio,
  caption,
  image,
  video,
  grow,
}: {
  ratio: string;
  caption: string;
  image?: string;
  video?: string;
  grow?: boolean;
}) {
  const [w, h] = ratio.split("x").map(Number);
  const [fig, ...rest] = caption.split("—");
  const label = rest.length ? fig.trim() : null;
  const text = rest.length ? rest.join("—").trim() : caption;
  return (
    <figure className={`flex flex-col gap-4 ${grow ? "flex-1" : ""}`} style={grow ? { flexGrow: w / h } : undefined}>
      <div style={{ aspectRatio: `${w}/${h}` }} className="relative w-full">
        <CropMarks />
        {video ? (
          // Muted, looping, inline: plays like an image. Reduced-motion users get the poster.
          <video
            src={video}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            className="h-full w-full rounded object-cover motion-reduce:hidden"
          />
        ) : null}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className={`h-full w-full rounded object-cover ${video ? "hidden motion-reduce:block" : ""}`}
          />
        ) : !video ? (
          <Placeholder className="h-full w-full" label="asset pending" />
        ) : null}
      </div>
      <figcaption className="flex gap-3 text-body-s text-neutral-700">
        {label && <span className="ds-label shrink-0 text-label text-primary-400">{label}</span>}
        <span>{text}</span>
      </figcaption>
    </figure>
  );
}

/**
 * "More work": the homepage work tiles, smaller. Up to three other published studies,
 * just above the CTA band, so it reads as a footnote, not a moment.
 */
function MoreWork({ current }: { current: string }) {
  const published = new Set(publishedCaseStudies.map((c) => c.slug));
  const tiles = caseStudiesSection.tiles
    .filter((t) => t.slug !== current && published.has(t.slug))
    .slice(0, 3);
  if (!tiles.length) return null;
  return (
    <section aria-labelledby="more-work-h" className="relative bg-neutral-100 py-16 lg:py-24">
      <Gridlines />
      <div className="measure relative z-[1] flex flex-col gap-10">
        <Eyebrow>
          <span id="more-work-h">More case studies</span>
        </Eyebrow>
        <Reveal as="ul" stagger className="grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-8 lg:grid-cols-12">
          {tiles.map((t) => (
            <WorkTile key={t.slug} t={{ ...t, layout: "third" }} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
