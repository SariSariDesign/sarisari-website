import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FooterCta } from "@/components/FooterCta";
import { HomePricing } from "@/components/HomePricing";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesList } from "@/components/ServicesList";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Process } from "@/components/Process";
import { TickNav } from "@/components/TickNav";
import { UseCases } from "@/components/UseCases";
import { WorkTile } from "@/components/WorkTile";
import { HangingShop } from "@/components/regulars/HangingShop";
import {
  about,
  caseStudiesSection,
  faq,
  hero,
  services,
  testimonials,
  useCases,
} from "@/content/site";
import { isExternal } from "@/lib/links";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <UseCasesSection />
        <Services />
        <CaseStudies />
        <Process />
        <Testimonials />
        <Pricing />
        <About />
        <Faq />
      </main>
      <FooterCta />
      <TickNav />
    </>
  );
}

function Hero() {
  return (
    // A "moment": grain on, gridlines off. 60/40 text to prints (7 + 5 of 12 columns).
    <section
      id="hero"
      data-hero
      className="grain flex flex-col overflow-hidden bg-neutral-100 lg:min-h-[calc(100svh-76px)]"
    >
      <div className="measure relative z-[1] grid flex-1 grid-cols-4 items-center gap-x-4 pb-8 pt-12 md:grid-cols-8 md:pt-16 lg:grid-cols-12 lg:py-10">
        {/* Load sequence: eyebrow 0ms, headline +80ms, subhead +180ms, CTAs +280ms. */}
        <div className="hero-seq col-span-full flex flex-col gap-8 lg:col-span-7">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1
            className="text-balance font-brand text-display-l italic text-neutral-1000"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {hero.headline}
          </h1>
          <p
            className="max-w-[44ch] text-lead text-neutral-700"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            {hero.subhead}
          </p>
          <div
            className="flex flex-wrap items-center gap-4"
            style={{ "--d": "280ms" } as React.CSSProperties}
          >
            {hero.ctas.map((cta) => (
              <Button
                key={cta.label}
                href={cta.href}
                variant={cta.variant}
                external={isExternal(cta.href)}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="relative col-span-full mx-auto mt-12 w-full max-w-[560px] lg:col-span-5 lg:mt-0 lg:max-w-none">
          <HangingShop />
        </div>
      </div>

      {/* Client logo strip, inside the measure. */}
      <div className="measure relative z-[1] pb-8">
        <Marquee items={hero.marquee.logos} />
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <Section
      id="use-cases"
      aria-labelledby="use-cases-h"
      className="bg-neutral-100"
    >
      <SectionHeader headingId="use-cases-h" headline={useCases.headline} />
      <UseCases />
    </Section>
  );
}

function Services() {
  return (
    <Section
      id="services"
      aria-labelledby="services-h"
      className="bg-neutral-200"
    >
      <SectionHeader
        headingId="services-h"
        eyebrow={services.eyebrow}
        headline={services.headline}
        intro={services.intro}
      />
      <Reveal>
        <ServicesList items={services.cards} />
      </Reveal>
      <Reveal className="mt-10">
        <Button href={services.seeAll.href} variant="ghost">
          {services.seeAll.label}
        </Button>
      </Reveal>
    </Section>
  );
}

function CaseStudies() {
  return (
    <Section id="work" aria-labelledby="work-h" className="bg-neutral-100">
      {/* Title left, "See all work" right. */}
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-4">
        <SectionHeader
          headingId="work-h"
          eyebrow={caseStudiesSection.eyebrow}
          headline={caseStudiesSection.headline}
          className=""
        />
        <Reveal delay={100}>
          <Button href={caseStudiesSection.seeAll.href} variant="ghost">
            {caseStudiesSection.seeAll.label}
          </Button>
        </Reveal>
      </div>
      <Reveal
        as="ul"
        stagger
        className="mt-12 grid grid-cols-4 gap-x-4 gap-y-16 md:grid-cols-8 lg:grid-cols-12"
      >
        {caseStudiesSection.tiles.map((t) => (
          <WorkTile key={t.slug} t={t} />
        ))}
      </Reveal>
    </Section>
  );
}

function About() {
  return (
    <Section id="about" aria-labelledby="about-h" className="bg-orange-100">
      <SectionHeader
        headingId="about-h"
        eyebrow={about.eyebrow}
        headline={about.headline}
      />
      <Reveal
        stagger
        className="mt-12 grid grid-cols-4 gap-x-4 gap-y-8 md:grid-cols-8 lg:grid-cols-12"
      >
        {about.members.map((m) => (
          <div
            key={m.name}
            className="col-span-4 flex flex-col gap-4 lg:col-span-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.photo}
              alt={`${m.name}, ${m.role}`}
              className="aspect-square w-full rounded object-cover"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-heading-m text-neutral-1000">{m.name}</h3>
              <span className="ds-label text-label text-neutral-700">
                {m.role}
              </span>
              <p className="mt-1 text-body text-neutral-700">{m.bio}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

function Testimonials() {
  return (
    <TestimonialCarousel
      headline={testimonials.headline}
      items={testimonials.items}
    />
  );
}

function Pricing() {
  return (
    <Section
      id="pricing"
      aria-labelledby="pricing-h"
      className="bg-neutral-200"
      hug
    >
      <HomePricing />
    </Section>
  );
}

function Faq() {
  const items = faq.items.map((f) => ({ label: f.q, body: f.a }));
  return (
    <Section id="faq" aria-labelledby="faq-h" className="bg-neutral-200">
      <div className="grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-8 lg:grid-cols-12">
        {/* Left: header, intro, CTA (sticks while the questions scroll on desktop). */}
        <div className="col-span-full lg:col-span-4">
          <div className="flex flex-col gap-8 lg:sticky lg:top-28">
            <SectionHeader
              headingId="faq-h"
              eyebrow={faq.eyebrow}
              headline={faq.headline}
              className=""
            />
            <Reveal delay={100} className="flex flex-col gap-8">
              <p className="max-w-[40ch] text-lead text-neutral-700">
                {faq.intro.before}
                <a
                  href={`mailto:${faq.intro.email}`}
                  className="text-neutral-1000 underline underline-offset-4 transition-colors duration-150 ease-out hover:text-primary-400"
                >
                  {faq.intro.email}
                </a>
                {faq.intro.after}
              </p>
              <div>
                <Button href={faq.cta.href} external>
                  {faq.cta.label}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
        {/* Right: questions. */}
        <Reveal className="col-span-full lg:col-span-7 lg:col-start-6">
          <Accordion items={items} defaultOpen={0} />
        </Reveal>
      </div>
    </Section>
  );
}
