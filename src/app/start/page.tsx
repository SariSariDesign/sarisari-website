import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FooterCta } from "@/components/FooterCta";
import { Gridlines } from "@/components/Gridlines";
import { HomePricing } from "@/components/HomePricing";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { WorkWall } from "@/components/WorkWall";
import { Wordmark } from "@/components/Wordmark";
import { ScorecardForm } from "@/components/scorecard/ScorecardForm";
import { faq, hero, testimonials } from "@/content/site";
import { squeeze } from "@/content/squeeze";
import { pageMetadata } from "@/lib/metadata";

// Ad landing page: not for organic search, so keep it out of the index.
export const metadata = {
  ...pageMetadata({ ...squeeze.meta, path: "/start" }),
  robots: { index: false, follow: false },
};

const mark = { yes: "✓", some: "Sometimes", no: "—" } as const;

export default function StartPage() {
  const faqItems = [squeeze.faqExtra, ...faq.items].map((f) => ({ label: f.q, body: f.a }));
  return (
    <>
      {/* Logo-only header: the logo goes home; nothing else pulls paid clicks away. */}
      <header className="sticky top-0 z-50 border-b border-neutral-300 bg-neutral-100/90 backdrop-blur-md">
        <div className="measure flex items-center justify-between py-4">
          <Link href="/" aria-label="Sari Sari Design home" className="py-2">
            <Wordmark className="text-[24px] text-neutral-1000" />
          </Link>
          <Button href={squeeze.cta.href} size="medium" external>
            {squeeze.cta.label}
          </Button>
        </div>
      </header>

      <main>
        {/* 1 · Hero: promise left, wall of client work right */}
        <section data-hero className="grain relative overflow-hidden bg-neutral-100">
          <Gridlines />
          <div className="measure relative z-[1] grid grid-cols-4 items-center gap-x-4 gap-y-12 pt-12 md:grid-cols-8 lg:h-[calc(100svh-76px)] lg:grid-cols-12 lg:py-0">
            <div className="hero-seq col-span-full flex flex-col gap-8 lg:col-span-6">
              <h1 className="text-balance text-display-m text-neutral-1000">
                <span className="block font-brand italic">{squeeze.hero.lead}</span>
                <span className="block">{squeeze.hero.rest}</span>
              </h1>
              <p className="max-w-[44ch] text-lead text-neutral-700">{squeeze.hero.subhead}</p>
              <div>
                <Button href={squeeze.hero.cta.href} external>
                  {squeeze.hero.cta.label}
                </Button>
              </div>
            </div>
            <WorkWall className="col-span-full h-[520px] md:h-[640px] lg:col-span-6 lg:h-full" />
          </div>
          <div className="measure relative z-[1] flex flex-col items-center gap-6 py-12">
            <p className="text-lead text-neutral-1000">{squeeze.logosLine}</p>
            <Marquee items={hero.marquee.logos} />
          </div>
        </section>

        {/* 2 · The problem, and that we fix it */}
        <Section id="intro" aria-labelledby="intro-h" className="bg-neutral-100" hug>
          <div className="grid grid-cols-4 gap-x-4 gap-y-8 md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-full flex flex-col gap-6 lg:col-span-6">
              <Eyebrow>{squeeze.intro.eyebrow}</Eyebrow>
              <h2 id="intro-h" className="text-balance font-brand text-display-s text-neutral-1000">
                {squeeze.intro.headline}
              </h2>
            </div>
            <div className="col-span-full flex flex-col items-start gap-8 lg:col-span-5 lg:col-start-8 lg:self-end">
              <p className="text-lead text-neutral-700">{squeeze.intro.body}</p>
              <Button href={squeeze.intro.cta.href} external>
                {squeeze.intro.cta.label}
              </Button>
            </div>
          </div>
        </Section>

        {/* 3 · Made for founders */}
        <Section id="flex" aria-labelledby="flex-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="flex-h" eyebrow={squeeze.flex.eyebrow} headline={squeeze.flex.headline} />
          <Reveal stagger className="mt-12 grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12">
            {squeeze.flex.items.map((item) => (
              <div
                key={item.title}
                className="col-span-4 flex flex-col justify-between gap-8 rounded border border-neutral-300 p-8 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-200 md:col-span-8 lg:col-span-4"
              >
                <div className="flex flex-col gap-4">
                  <h3 className="text-heading-m text-neutral-1000">{item.title}</h3>
                  <p className="text-body text-neutral-700">{item.body}</p>
                </div>
                <figure className="flex flex-col gap-2">
                  <blockquote className="font-brand text-lead italic text-neutral-1000">&ldquo;{item.quote}&rdquo;</blockquote>
                  <figcaption className="text-body-s text-neutral-700">{item.who}</figcaption>
                </figure>
              </div>
            ))}
          </Reveal>
        </Section>

        {/* 4 · Success in numbers */}
        <section className="bg-primary-400 text-neutral-100">
          <div className="measure flex flex-col gap-12 py-16 lg:py-24">
            <div className="flex flex-col gap-4">
              <span className="ds-label text-label text-primary-100">{squeeze.numbers.eyebrow}</span>
              <h2 className="font-brand text-display-s text-neutral-100">{squeeze.numbers.headline}</h2>
            </div>
            <div className="grid grid-cols-4 gap-x-4 gap-y-10 md:grid-cols-8 lg:grid-cols-12">
              {squeeze.numbers.items.map((s) => (
                <div key={s.value} className="col-span-4 flex flex-col gap-2">
                  <span className="font-brand text-display-m text-neutral-100">{s.value}</span>
                  <span className="max-w-[28ch] text-body text-primary-100">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 · Offers & prices (each card keeps its own tracked booking link) */}
        <Section id="pricing" aria-labelledby="pricing-h" className="bg-neutral-100" hug>
          <HomePricing showScorecard={false} />
        </Section>

        {/* 6 · Versus the alternatives */}
        <Section id="versus" aria-labelledby="versus-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="versus-h" eyebrow={squeeze.versus.eyebrow} headline={squeeze.versus.headline} />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-1/3 py-4" />
                  {squeeze.versus.columns.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={`ds-label px-4 py-4 text-center text-label ${i === 0 ? "rounded-t bg-primary-400 text-neutral-100" : "text-neutral-700"}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {squeeze.versus.rows.map((r) => (
                  <tr key={r.label} className="border-t border-neutral-300">
                    <th scope="row" className="py-5 pr-4 text-body text-neutral-1000">{r.label}</th>
                    {r.values.map((v, i) => (
                      <td
                        key={i}
                        className={`px-4 py-5 text-center text-body ${i === 0 ? "bg-primary-100 text-primary-500" : v === "yes" ? "text-neutral-1000" : "text-neutral-700"}`}
                      >
                        {mark[v]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 7 · Why Sari Sari */}
        <Section id="why" aria-labelledby="why-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="why-h" eyebrow={squeeze.why.eyebrow} headline={squeeze.why.headline} />
          <Reveal stagger className="mt-12 grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-8 lg:grid-cols-12">
            {squeeze.why.items.map((item) => (
              <div key={item.title} className="col-span-4 flex flex-col gap-3 lg:col-span-6">
                <span className="ds-label text-label text-primary-400">{item.label}</span>
                <h3 className="text-heading-l text-neutral-1000">{item.title}</h3>
                <p className="max-w-[48ch] text-body text-neutral-700">{item.body}</p>
              </div>
            ))}
          </Reveal>
          <div className="mt-12">
            <Button href={squeeze.cta.href} external>
              {squeeze.cta.label}
            </Button>
          </div>
        </Section>

        {/* 8 · Proof */}
        <TestimonialCarousel headline={testimonials.headline} items={testimonials.items} />

        {/* 9 · Free Scorecard, tagged with ad attribution */}
        <Section id="scorecard" aria-labelledby="scorecard-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="scorecard-h" eyebrow={squeeze.scorecard.eyebrow} headline={squeeze.scorecard.headline} />
          <div className="mx-auto mt-12 max-w-[1000px]">
            <ScorecardForm source="squeeze-start" />
          </div>
        </Section>

        {/* 10 · FAQ */}
        <Section id="faq" aria-labelledby="faq-h" className="bg-neutral-100" hug>
          <div className="grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-full flex flex-col gap-8 lg:col-span-4">
              <SectionHeader headingId="faq-h" headline={faq.headline} className="" />
              <div>
                <Button href={squeeze.cta.href} external>
                  {squeeze.cta.label}
                </Button>
              </div>
            </div>
            <Reveal className="col-span-full lg:col-span-7 lg:col-start-6">
              <Accordion items={faqItems} defaultOpen={0} />
            </Reveal>
          </div>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
