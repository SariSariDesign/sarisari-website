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

export default function StartPage() {
  const faqItems = [squeeze.faqExtra, ...faq.items].map((f) => ({ label: f.q, body: f.a }));
  return (
    <>
      {/* Logo-only header: nothing pulls paid clicks off the page except the logo home link. */}
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
        {/* 1 · Hero: their pain + our fix on the left, a wall of client work on the right */}
        <section data-hero className="grain relative overflow-hidden bg-neutral-100">
          <Gridlines />
          <div className="measure relative z-[1] grid grid-cols-4 items-center gap-x-4 gap-y-12 pt-12 md:grid-cols-8 lg:min-h-[calc(100svh-76px)] lg:grid-cols-12 lg:py-0">
            <div className="hero-seq col-span-full flex flex-col gap-8 lg:col-span-6">
              <Eyebrow>{squeeze.hero.eyebrow}</Eyebrow>
              <h1 className="text-balance font-brand text-display-m italic text-neutral-1000">
                {squeeze.hero.headline}
              </h1>
              <p className="max-w-[44ch] text-lead text-neutral-700">{squeeze.hero.subhead}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href={squeeze.hero.cta.href} external>
                  {squeeze.hero.cta.label}
                </Button>
                <Button href={squeeze.hero.secondary.href} variant="ghost">
                  {squeeze.hero.secondary.label}
                </Button>
              </div>
            </div>
            <WorkWall className="col-span-full h-[520px] md:h-[640px] lg:col-span-6 lg:h-[calc(100svh-76px)]" />
          </div>
          <div className="measure relative z-[1] py-8">
            <Marquee items={hero.marquee.logos} />
          </div>
        </section>

        {/* 2 · Their pains, in their words, each answered with what we do */}
        <Section id="pains" aria-labelledby="pains-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="pains-h" eyebrow={squeeze.pains.eyebrow} headline={squeeze.pains.headline} />
          <Reveal stagger className="mt-12 grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12">
            {squeeze.pains.items.map((p) => (
              <div
                key={p.quote}
                className="col-span-4 flex flex-col justify-between gap-10 rounded border border-neutral-300 bg-neutral-100 p-8 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-200 lg:col-span-6"
              >
                <p className="font-brand text-heading-l italic text-neutral-1000">&ldquo;{p.quote}&rdquo;</p>
                <div className="flex flex-col gap-2">
                  <span className="ds-label text-label text-primary-400">How we help</span>
                  <p className="text-lead text-neutral-1000">{p.help}</p>
                  {p.note && <p className="text-body-s text-neutral-700">{p.note}</p>}
                </div>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 text-body-s text-neutral-600">{squeeze.pains.source}</p>
        </Section>

        {/* 3 · Proof in numbers */}
        <section className="bg-primary-400 text-neutral-100">
          <div className="measure grid grid-cols-4 gap-x-4 gap-y-10 py-16 md:grid-cols-8 lg:grid-cols-12 lg:py-20">
            {squeeze.stats.map((s) => (
              <div key={s.value} className="col-span-4 flex flex-col gap-2 lg:col-span-4">
                <span className="font-brand text-display-m text-neutral-100">{s.value}</span>
                <span className="max-w-[28ch] text-body text-primary-100">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4 · How we fix it */}
        <Section id="how" aria-labelledby="how-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="how-h" eyebrow={squeeze.how.eyebrow} headline={squeeze.how.headline} />
          <Reveal stagger className="mt-12 grid grid-cols-4 gap-x-4 gap-y-10 md:grid-cols-8 lg:grid-cols-12">
            {squeeze.how.steps.map((step, i) => (
              <div key={step.title} className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-4">
                <span className="font-brand text-display-s text-primary-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-heading-m text-neutral-1000">{step.title}</h3>
                <p className="text-body text-neutral-700">{step.body}</p>
              </div>
            ))}
          </Reveal>
          <div className="mt-12">
            <Button href={squeeze.cta.href} external>
              {squeeze.cta.label}
            </Button>
          </div>
        </Section>

        {/* 5 · Proof */}
        <TestimonialCarousel headline={testimonials.headline} items={testimonials.items} />

        {/* 6 · Offers & prices (each card keeps its own tracked booking link) */}
        <Section id="pricing" aria-labelledby="pricing-h" className="bg-neutral-100" hug>
          <HomePricing showScorecard={false} />
        </Section>

        {/* 7 · Free Scorecard, tagged with ad attribution */}
        <Section id="scorecard" aria-labelledby="scorecard-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="scorecard-h" eyebrow={squeeze.scorecard.eyebrow} headline={squeeze.scorecard.headline} />
          <div className="mt-12 mx-auto max-w-[1000px]">
            <ScorecardForm source="squeeze-start" />
          </div>
        </Section>

        {/* 8 · FAQ */}
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
