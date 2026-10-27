import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { Placeholder } from "@/components/Placeholder";
import { type CaseStudyBlock, getCaseStudy, publishedCaseStudies } from "@/content/case-studies";
import { pageMetadata } from "@/lib/metadata";

type Params = { slug: string };

/** Only published case studies get a page; coming-soon slugs 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return publishedCaseStudies.map((c) => ({ slug: c.slug }));
}

const load = (slug: string) => {
  const study = getCaseStudy(slug);
  return study?.status === "published" && study.page ? study.page : null;
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = load(slug);
  return page ? pageMetadata({ title: page.title, description: page.intro, path: `/work/${slug}` }) : {};
}

/** Case-study template: renders any published entry in `src/content/case-studies`. */
export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const page = load((await params).slug);
  if (!page) notFound();
  return (
    <>
      <Nav />
      <main className="bg-neutral-100">
        <div className="measure">
          {/* headline */}
          <header className="flex flex-col gap-6 py-16 md:py-24">
            <h1 className="max-w-[971px] font-brand text-[clamp(36px,5vw,72px)] leading-[1.1] tracking-[-0.014em] text-primary-600">
              {page.title}
            </h1>
            <p className="ds-label text-label-l text-neutral-900">{page.byline}</p>
          </header>

          {/* hero image */}
          {page.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.heroImage}
              alt=""
              className="aspect-video w-full object-cover"
            />
          ) : (
            <Placeholder className="aspect-video w-full" label="Hero image — asset pending" />
          )}

          {/* article */}
          <div className="grid gap-12 py-16 md:py-24 lg:grid-cols-[180px_1fr]">
            <aside className="ds-label flex flex-row gap-6 text-label-m text-neutral-900 lg:flex-col">
              {page.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </aside>

            <article className="flex max-w-[760px] flex-col gap-12">
              <HeroStats stats={page.heroStats} />
              <p className="font-brand text-h3 text-primary-600">{page.intro}</p>
              {page.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </article>
          </div>
        </div>
      </main>
      <FooterCta />
    </>
  );
}

function HeroStats({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-12 sm:flex-row">
      {stats.map((s) => (
        <div key={s.value} className="flex flex-1 flex-col gap-2">
          <span className="font-brand text-display-s text-neutral-900">{s.value}</span>
          <span className="ds-label text-label-m text-neutral-700">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.kind) {
    case "section":
      return (
        <section className="flex flex-col gap-3">
          {block.label && (
            <span className="ds-label text-label-m text-neutral-900">{block.label}</span>
          )}
          <h2 className="text-title-l font-medium text-primary-600">{block.title}</h2>
          <Paragraphs paragraphs={block.paragraphs} />
        </section>
      );
    case "step":
      return (
        <section className="flex flex-col gap-3">
          <h3 className="text-title-m font-medium text-primary-600">{block.title}</h3>
          <Paragraphs paragraphs={block.paragraphs} />
        </section>
      );
    case "quote":
      return (
        <figure className="flex flex-col gap-4 py-4">
          <blockquote className="font-brand text-display-s text-primary-600">
            {block.quote}
          </blockquote>
          <figcaption className="flex flex-col gap-1">
            <span className="ds-label text-label-m text-neutral-900">{block.name}</span>
            <span className="text-body-s text-neutral-700">{block.role}</span>
          </figcaption>
        </figure>
      );
    case "stats": {
      return block.big ? (
        <div className="flex flex-col py-4">
          {block.stats.map((s, i) => (
            <div
              key={s.value}
              className={`flex flex-col gap-2 py-8 ${i > 0 ? "border-t border-neutral-400" : ""}`}
            >
              <span className="font-brand text-display-m text-primary-600">{s.value}</span>
              <span className="ds-label text-label-m text-neutral-900">{s.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-12 sm:flex-row">
          {block.stats.map((s) => (
            <div key={s.value} className="flex flex-1 flex-col gap-2">
              <span className="font-brand text-display-m text-primary-600">{s.value}</span>
              <span className="ds-label text-label-m text-neutral-900">{s.label}</span>
            </div>
          ))}
        </div>
      );
    }
    case "figure":
      return <Figure ratio={block.ratio} caption={block.caption} image={block.image} />;
    case "figure-row":
      return (
        <div className="flex flex-col gap-4 py-4 sm:flex-row">
          {block.figures.map((f) => (
            <Figure key={f.caption} ratio={f.ratio} caption={f.caption} image={f.image} grow />
          ))}
        </div>
      );
    case "split":
      return (
        <section className="flex flex-col gap-4 py-4 md:flex-row md:gap-8">
          <h2 className="font-brand text-h3 text-primary-600 md:w-[379px]">{block.title}</h2>
          <div className="flex flex-1 flex-col gap-3">
            <Paragraphs paragraphs={block.paragraphs} />
          </div>
        </section>
      );
    default:
      return null;
  }
}

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 32)} className="whitespace-pre-line text-body-m text-neutral-700">
          {p}
        </p>
      ))}
    </>
  );
}

function Figure({
  ratio,
  caption,
  image,
  grow,
}: {
  ratio: string;
  caption: string;
  image?: string;
  grow?: boolean;
}) {
  const [w, h] = ratio.split("x").map(Number);
  return (
    <figure className={`flex flex-col gap-3 py-4 ${grow ? "flex-1" : ""}`}>
      <div style={{ aspectRatio: `${w}/${h}` }} className="w-full">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <Placeholder className="h-full w-full" label="asset pending" />
        )}
      </div>
      <figcaption className="flex flex-col gap-1">
        <span className="ds-label text-label-s text-neutral-900">{caption.split("—")[0]}</span>
        <span className="text-body-s text-neutral-900">{caption}</span>
      </figcaption>
    </figure>
  );
}
