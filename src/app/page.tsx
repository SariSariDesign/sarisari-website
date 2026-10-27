import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Eyebrow } from "@/components/Eyebrow";
import { FooterCta } from "@/components/FooterCta";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { OfferCards } from "@/components/OfferCards";
import { Reveal } from "@/components/Reveal";
import { RetainerPanel } from "@/components/RetainerPanel";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesList } from "@/components/ServicesList";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TickNav } from "@/components/TickNav";
import { HangingShop } from "@/components/regulars/HangingShop";
import { caseStudies } from "@/content/case-studies";
import {
  about,
  caseStudiesSection,
  faq,
  hero,
  pricing,
  services,
  testimonials,
} from "@/content/site";
import { isExternal } from "@/lib/links";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <CaseStudies />
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
    // A "moment": grain on, gridlines off. Fits one viewport at 1440×900.
    <section
      id="hero"
      data-hero
      className="grain flex flex-col overflow-hidden bg-neutral-100 lg:min-h-[calc(100svh-76px)]"
    >
      <div className="measure relative z-[1] flex flex-1 flex-col justify-center pb-8 pt-12 md:pt-16 lg:py-8">
        {/* Load sequence: eyebrow 0ms, headline +80ms, subhead +180ms, CTAs +280ms. */}
        <div className="hero-seq grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12">
          <Eyebrow className="col-span-full">{hero.eyebrow}</Eyebrow>
          {/* Headline spans all 12 columns above the 60/40 split. */}
          <h1
            className="col-span-full mt-6 text-balance font-brand text-display-l italic text-neutral-1000"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {hero.headline}
          </h1>
          {/* 60%: subhead + CTAs */}
          <div
            className="col-span-full mt-8 flex flex-col gap-8 self-start lg:col-span-7 lg:mt-8"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            <p className="max-w-[44ch] text-lead text-neutral-700">{hero.subhead}</p>
            <div className="flex flex-wrap items-center gap-4">
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
          {/* 40%: prints. */}
          <div
            className="relative col-span-full mx-auto mt-10 w-full max-w-[560px] lg:col-span-5 lg:mt-8 lg:max-w-none"
            style={{ "--d": "280ms" } as React.CSSProperties}
          >
            <HangingShop />
          </div>
        </div>
      </div>

      {/* Client logo strip, inside the measure. */}
      <div className="measure relative z-[1] pb-8">
        <Marquee items={hero.marquee.logos} />
      </div>
    </section>
  );
}

function Services() {
  return (
    <Section id="services" aria-labelledby="services-h" className="bg-neutral-200">
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
      <SectionHeader
        headingId="work-h"
        eyebrow={caseStudiesSection.eyebrow}
        headline={caseStudiesSection.headline}
      />
      <Reveal stagger className="mt-12 grid grid-cols-4 gap-x-4 gap-y-14 md:grid-cols-8 lg:grid-cols-12">
        {caseStudies.slice(0, 3).map((c, i) => (
          <CaseStudyCard key={c.slug} c={c} featured={i === 0} />
        ))}
      </Reveal>
      <Reveal className="mt-10">
        <Button href={caseStudiesSection.seeAll.href} variant="ghost">
          {caseStudiesSection.seeAll.label}
        </Button>
      </Reveal>
    </Section>
  );
}

function About() {
  return (
    <Section id="about" aria-labelledby="about-h" className="bg-orange-100">
      <SectionHeader headingId="about-h" eyebrow={about.eyebrow} headline={about.headline} />
      <Reveal stagger className="mt-16 grid grid-cols-4 gap-x-4 gap-y-8 md:grid-cols-8 lg:grid-cols-12">
        {about.members.map((m) => (
          <div key={m.name} className="col-span-4 flex flex-col gap-4 lg:col-span-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.photo}
              alt={`${m.name}, ${m.role}`}
              className="aspect-square w-full object-cover grayscale"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-heading-m text-neutral-1000">{m.name}</h3>
              <span className="ds-label text-label text-neutral-700">{m.role}</span>
              <p className="mt-2 text-body text-neutral-700">{m.bio}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section id="testimonials" aria-labelledby="testimonials-h" className="bg-neutral-100">
      <SectionHeader
        headingId="testimonials-h"
        eyebrow={testimonials.eyebrow}
        headline={testimonials.headline}
      />
      <Reveal>
        <TestimonialCarousel items={testimonials.items} />
      </Reveal>
    </Section>
  );
}

function Pricing() {
  return (
    <Section id="pricing" aria-labelledby="pricing-h" className="bg-neutral-200">
      <SectionHeader headingId="pricing-h" eyebrow={pricing.eyebrow} headline={pricing.headline} />
      <Reveal className="mt-12">
        <RetainerPanel retainer={pricing.retainer} />
      </Reveal>
      <Reveal className="mt-8">
        <Button href={pricing.compare.href} variant="ghost">
          {pricing.compare.label}
        </Button>
      </Reveal>
      <Reveal className="mt-16 flex flex-col gap-4">
        <h3 className="text-heading-m text-neutral-1000">{pricing.offersHeading}</h3>
        <OfferCards offers={pricing.offers} />
      </Reveal>
    </Section>
  );
}

function Faq() {
  const items = faq.items.map((f) => ({ label: f.q, body: f.a }));
  return (
    <Section id="faq" aria-labelledby="faq-h" className="bg-neutral-200">
      <SectionHeader headingId="faq-h" eyebrow={faq.eyebrow} headline={faq.headline} />
      <Reveal className="mt-12">
        <Accordion items={items} defaultOpen={0} />
      </Reveal>
    </Section>
  );
}
