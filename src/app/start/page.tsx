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
import { WorkTile } from "@/components/WorkTile";
import { Wordmark } from "@/components/Wordmark";
import { ScorecardForm } from "@/components/scorecard/ScorecardForm";
import { caseStudiesSection, faq, hero, testimonials } from "@/content/site";
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
        {/* 1 · Hero */}
        <section data-hero className="grain flex flex-col overflow-hidden bg-neutral-100 lg:min-h-[calc(100svh-76px)]">
          <Gridlines />
          <div className="measure relative z-[1] grid flex-1 grid-cols-4 items-center gap-x-4 pb-8 pt-12 md:grid-cols-8 md:pt-16 lg:grid-cols-12 lg:py-10">
            <div className="hero-seq col-span-full flex flex-col gap-8 lg:col-span-9">
              <Eyebrow>{squeeze.hero.eyebrow}</Eyebrow>
              <h1 className="text-balance font-brand text-display-l italic text-neutral-1000">
                {squeeze.hero.headline}
              </h1>
              <p className="max-w-[44ch] text-lead text-neutral-700">{squeeze.hero.subhead}</p>
              <div>
                <Button href={squeeze.hero.cta.href} external>
                  {squeeze.hero.cta.label}
                </Button>
              </div>
            </div>
          </div>
          <div className="measure relative z-[1] pb-8">
            <Marquee items={hero.marquee.logos} />
          </div>
        </section>

        {/* 2 · Work wall */}
        <Section id="work" aria-labelledby="work-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="work-h" eyebrow={squeeze.work.eyebrow} headline={squeeze.work.headline} />
          <Reveal as="ul" stagger className="mt-12 grid grid-cols-4 gap-x-4 gap-y-16 md:grid-cols-8 lg:grid-cols-12">
            {caseStudiesSection.tiles.map((t) => (
              <WorkTile key={t.slug} t={t} />
            ))}
          </Reveal>
        </Section>

        {/* 3 · The problem */}
        <Section id="problem" aria-labelledby="problem-h" className="bg-neutral-100" hug>
          <div className="grid grid-cols-4 gap-x-4 gap-y-8 md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-full flex flex-col gap-6 lg:col-span-9">
              <Eyebrow>{squeeze.problem.eyebrow}</Eyebrow>
              <h2 id="problem-h" className="text-balance font-brand text-display-s text-neutral-1000">
                {squeeze.problem.headline}
              </h2>
              <p className="max-w-[52ch] text-lead text-neutral-700">{squeeze.problem.body}</p>
              <p className="text-body-s text-neutral-600">{squeeze.problem.source}</p>
            </div>
          </div>
        </Section>

        {/* 4 · How we work */}
        <Section id="how" aria-labelledby="how-h" className="bg-neutral-100" hug>
          <SectionHeader headingId="how-h" eyebrow={squeeze.how.eyebrow} headline={squeeze.how.headline} />
          <Reveal stagger className="mt-12 grid grid-cols-4 gap-x-4 gap-y-10 md:grid-cols-8 lg:grid-cols-12">
            {squeeze.how.items.map((item, i) => (
              <div key={item.title} className="col-span-4 flex flex-col gap-3 md:col-span-4 lg:col-span-3">
                <span className="ds-label text-label text-primary-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-heading-m text-neutral-1000">{item.title}</h3>
                <p className="text-body text-neutral-700">{item.body}</p>
              </div>
            ))}
          </Reveal>
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
