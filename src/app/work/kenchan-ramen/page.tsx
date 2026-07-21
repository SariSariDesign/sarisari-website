import type { Metadata } from "next";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { Placeholder } from "@/components/Placeholder";
import { kenchan, type KenchanBlock } from "@/content/kenchan";

export const metadata: Metadata = {
  title: `${kenchan.title} — Sari Sari Design`,
  description: kenchan.intro,
};

export default function KenchanCaseStudy() {
  return (
    <>
      <Nav />
      <main className="bg-neutral-100">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-4">
          {/* headline */}
          <header className="flex flex-col gap-6 py-16 md:py-24">
            <h1 className="max-w-[971px] font-brand text-[clamp(36px,5vw,72px)] leading-[1.1] tracking-[-0.014em] text-primary-600">
              {kenchan.title}
            </h1>
            <p className="ds-label text-label-l text-neutral-900">{kenchan.client}</p>
          </header>

          {/* hero image */}
          <Placeholder className="aspect-video w-full" label="Bundle builder hero — asset pending" />

          {/* article */}
          <div className="grid gap-12 py-16 md:py-24 lg:grid-cols-[180px_1fr]">
            <aside className="ds-label flex flex-row gap-6 text-label-m text-neutral-900 lg:flex-col">
              {kenchan.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </aside>

            <article className="flex max-w-[760px] flex-col gap-12">
              <HeroStats />
              <p className="font-brand text-h3 text-primary-600">{kenchan.intro}</p>
              {kenchan.blocks.map((block, i) => (
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

function HeroStats() {
  return (
    <div className="flex flex-col gap-12 sm:flex-row">
      {kenchan.heroStats.map((s) => (
        <div key={s.value} className="flex flex-1 flex-col gap-2">
          <span className="font-brand text-display-s text-neutral-900">{s.value}</span>
          <span className="ds-label text-label-m text-neutral-600">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function Block({ block }: { block: KenchanBlock }) {
  switch (block.kind) {
    case "section":
      return (
        <section className="flex flex-col gap-3">
          {"label" in block && block.label && (
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
            <span className="text-body-s text-neutral-600">{block.role}</span>
          </figcaption>
        </figure>
      );
    case "stats": {
      const big = "big" in block && block.big;
      return big ? (
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
      return <Figure ratio={block.ratio} caption={block.caption} />;
    case "figure-row":
      return (
        <div className="flex flex-col gap-4 py-4 sm:flex-row">
          {block.figures.map((f) => (
            <Figure key={f.caption} ratio={f.ratio} caption={f.caption} grow />
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

function Figure({ ratio, caption, grow }: { ratio: string; caption: string; grow?: boolean }) {
  const [w, h] = ratio.split("x").map(Number);
  return (
    <figure className={`flex flex-col gap-3 py-4 ${grow ? "flex-1" : ""}`}>
      <div style={{ aspectRatio: `${w}/${h}` }} className="w-full">
        <Placeholder className="h-full w-full" label="asset pending" />
      </div>
      <figcaption className="flex flex-col gap-1">
        <span className="ds-label text-label-s text-neutral-900">{caption.split("—")[0]}</span>
        <span className="text-body-s text-neutral-900">{caption}</span>
      </figcaption>
    </figure>
  );
}
