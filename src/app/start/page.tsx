import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FooterCta } from "@/components/FooterCta";
import { Gridlines } from "@/components/Gridlines";
import { Marquee } from "@/components/Marquee";
import { OfferGrid } from "@/components/OfferGrid";
import { PhosphorIcon, type PhosphorName } from "@/components/PhosphorIcon";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkCarousel } from "@/components/WorkCarousel";
import { Wordmark } from "@/components/Wordmark";
import { ScorecardForm } from "@/components/scorecard/ScorecardForm";
import { faq, hero } from "@/content/site";
import { squeeze } from "@/content/squeeze";
import { pageMetadata } from "@/lib/metadata";

// Ad landing page: not for organic search, so keep it out of the index.
export const metadata = {
  ...pageMetadata({ ...squeeze.meta, path: "/start" }),
  robots: { index: false, follow: false },
};

export default function StartPage() {
  const faqItems = faq.items
    .filter((f) => !squeeze.faqHide.includes(f.q))
    .map((f) => ({ label: f.q, body: f.a }));
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
        {/* 1 · Hero: statement, two actions, then a row of work that runs off the right edge */}
        <section data-hero className="grain relative overflow-hidden bg-neutral-100">
          <Gridlines />
          <div className="measure relative z-[1] grid grid-cols-4 gap-x-4 pb-12 pt-16 md:grid-cols-8 md:pt-24 lg:grid-cols-12">
            <div className="hero-seq col-span-full flex flex-col gap-8 lg:col-span-9">
              <h1 className="text-balance text-display-m text-neutral-1000">
                <span className="font-brand italic">{squeeze.hero.lead}</span> {squeeze.hero.rest}
              </h1>
              <p className="max-w-[52ch] text-lead text-neutral-700">{squeeze.hero.subhead}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href={squeeze.hero.cta.href} external>
                  {squeeze.hero.cta.label}
                </Button>
                <Button href={squeeze.hero.secondary.href} variant="ghost">
                  {squeeze.hero.secondary.label}
                </Button>
              </div>
            </div>
          </div>
          <div className="relative z-[1]">
            <WorkCarousel />
          </div>
          <div className="measure relative z-[1] flex flex-col items-center gap-6 py-12">
            <p className="text-lead text-neutral-1000">{squeeze.logosLine}</p>
            <Marquee items={hero.marquee.logos} />
          </div>
        </section>

        {/* 2 · Approach: how we keep their users */}
        <Section id="approach" aria-labelledby="approach-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="approach-h" eyebrow={squeeze.approach.eyebrow} headline={squeeze.approach.headline} />
          <Reveal stagger className="mt-12 grid grid-cols-4 gap-x-4 gap-y-10 md:grid-cols-8 lg:grid-cols-12">
            {squeeze.approach.steps.map((step, i) => (
              <div key={step.title} className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-4">
                <span className="font-brand text-display-s text-primary-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-heading-m text-neutral-1000">{step.title}</h3>
                <p className="text-body text-neutral-700">{step.body}</p>
              </div>
            ))}
          </Reveal>
        </Section>

        {/* 3 · Results: one statement per client, backed by their own words */}
        <Section id="results" aria-labelledby="results-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="results-h" eyebrow={squeeze.results.eyebrow} headline={squeeze.results.headline} />
          {/* Mobile: one row that scrolls sideways so the section stays short. */}
          <Reveal
            stagger
            className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-8 md:overflow-visible md:px-0 lg:grid-cols-12 [&::-webkit-scrollbar]:hidden"
          >
            {squeeze.results.items.map((r, i) => (
              <figure
                key={r.who}
                className={`flex w-[85%] shrink-0 snap-start flex-col justify-between gap-10 rounded bg-neutral-200 p-8 transition-colors duration-150 ease-out hover:bg-primary-100 md:col-span-8 md:w-auto ${i < 3 ? "lg:col-span-4" : "lg:col-span-6"}`}
              >
                <h3 className="text-lead text-neutral-1000">{r.statement}</h3>
                <div className="flex flex-col gap-3">
                  <div className="relative pt-6">
                    {/* Watermark quote mark, tucked behind the first line. */}
                    <span aria-hidden className="pointer-events-none absolute -left-1 -top-4 select-none font-brand text-display-l leading-none text-primary-200">
                      &ldquo;
                    </span>
                    <blockquote className="relative font-brand text-heading-m text-neutral-600">{r.quote}</blockquote>
                  </div>
                  <figcaption className="text-body-s text-neutral-700">{r.who}</figcaption>
                </div>
              </figure>
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

        {/* 5 · Benefits */}
        <Section id="why" aria-labelledby="why-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="why-h" eyebrow={squeeze.why.eyebrow} headline={squeeze.why.headline} />
          <Reveal stagger className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12">
            {squeeze.why.items.map((item) => (
              <div key={item.title} className="group flex flex-col gap-3">
                <PhosphorIcon name={item.icon as PhosphorName} className="nudge-x mb-2 text-primary-400" />
                <span className="ds-label text-label text-primary-400">{item.label}</span>
                <h3 className="text-heading-m text-neutral-1000 md:text-heading-l">{item.title}</h3>
                <p className="max-w-[48ch] text-body text-neutral-700">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </Section>

        {/* 6 · Versus the alternatives */}
        <Section id="versus" aria-labelledby="versus-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="versus-h" eyebrow={squeeze.versus.eyebrow} headline={squeeze.versus.headline} />
          {/* Row labels and the Sari Sari column stay pinned; the other four scroll on small screens. */}
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="sticky left-0 z-[2] w-[120px] bg-neutral-100 py-4 md:w-auto" />
                  {squeeze.versus.columns.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={`px-4 py-4 text-body text-neutral-1000 ${i === 0 ? "sticky left-[120px] z-[2] w-[150px] rounded-t bg-primary-400 text-neutral-100 md:static" : ""}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {squeeze.versus.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="sticky left-0 z-[1] border-t border-neutral-300 bg-neutral-100 py-5 pr-4 align-top text-body text-neutral-1000">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td
                        key={i}
                        className={`border-t px-4 py-5 align-top text-body ${i === 0 ? "sticky left-[120px] z-[1] border-primary-200 bg-primary-100 text-primary-500 md:static" : "border-neutral-300 text-neutral-700"}`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 7 · Pricing (each card keeps its own tracked booking link) */}
        <Section id="pricing" aria-labelledby="pricing-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="pricing-h" eyebrow={squeeze.pricing.eyebrow} headline={squeeze.pricing.headline} />
          <div className="mt-12">
            <OfferGrid offers={squeeze.pricing.offers} />
          </div>
        </Section>

        {/* 8 · Free Scorecard, tagged with ad attribution */}
        <Section id="scorecard" aria-labelledby="scorecard-h" className="bg-neutral-100" hug>
          <div className="grid grid-cols-4 gap-x-4 gap-y-10 rounded bg-neutral-200 p-6 md:grid-cols-8 md:p-10 lg:grid-cols-12">
            <div className="col-span-full flex flex-col gap-4 lg:col-span-5">
              <span className="ds-label text-label text-primary-400">{squeeze.scorecard.eyebrow}</span>
              <h2 id="scorecard-h" className="font-brand text-display-s text-neutral-1000">
                {squeeze.scorecard.headline}
              </h2>
              <p className="max-w-[40ch] text-lead text-neutral-700">{squeeze.scorecard.body}</p>
            </div>
            <div className="col-span-full lg:col-span-6 lg:col-start-7">
              <ScorecardForm source="squeeze-start" compact submitLabel={squeeze.scorecard.submitLabel} />
            </div>
          </div>
        </Section>

        {/* 9 · FAQ */}
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
