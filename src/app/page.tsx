import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { FooterCta } from "@/components/FooterCta";
import { Gridlines } from "@/components/Gridlines";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { OfferCards } from "@/components/OfferCards";
import { Reveal } from "@/components/Reveal";
import { RetainerPanel } from "@/components/RetainerPanel";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesList } from "@/components/ServicesList";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { HangingShop } from "@/components/regulars/HangingShop";
import { Regulars as RegularsWall } from "@/components/regulars/Regulars";
import { caseStudies } from "@/content/case-studies";
import {
  about,
  caseStudiesSection,
  faq,
  hero,
  pricing,
  services,
  testimonials,
  why,
  work,
} from "@/content/site";
import { isExternal } from "@/lib/links";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Regulars />
        <Services />
        <CaseStudies />
        <Pricing />
        <About />
        <Testimonials />
        <Faq />
      </main>
      <FooterCta />
    </>
  );
}

function Hero() {
  const active = hero.headlineOptions[hero.activeHeadline];
  return (
    // At lg the hero stops ~150px short of the viewport bottom so the "Our Regulars"
    // header peeks in on landing (76px = sticky nav height).
    <section data-hero className="relative overflow-hidden bg-neutral-100 lg:h-[calc(100svh-76px-150px)] lg:min-h-[620px]">
      <Gridlines />
      <div className="relative z-[1] flex h-full flex-col">
        {/* Full-width split: content left (aligned to the 1200px measure), graphic bleeds right. */}
        <div className="grid min-h-0 flex-1 lg:grid-cols-2">
          <div className="flex items-center px-6 pb-12 pt-16 md:px-8 md:pt-24 lg:py-12 lg:pl-[max(2rem,calc((100vw-1200px)/2+1.5rem))] lg:pr-12">
            <Reveal className="flex max-w-[780px] flex-col gap-8">
              <h1 className="text-balance font-brand text-[clamp(52px,6.5vw,109px)] italic leading-[1.02] tracking-[-0.02em] text-neutral-1000">
                {active.headline}
              </h1>
              <p className="max-w-[40ch] text-[clamp(22px,1.9vw,29px)] leading-[1.35] tracking-[0.25px] text-neutral-700">
                {hero.subhead}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
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
            </Reveal>
          </div>

          <div className="relative px-6 pb-12 md:px-8 lg:p-0 lg:pt-6">
            <HangingShop />
          </div>
        </div>

        {/* Label sits on the 1200px measure; the logo strip runs the full viewport width. */}
        <div className="flex flex-col gap-8 pb-16 pt-8 md:pb-24 lg:pb-12 lg:pt-20">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
            <span className="ds-label text-[15px] leading-[18px] tracking-[2px] text-neutral-700">
              {hero.marquee.label}
            </span>
          </div>
          <Marquee items={hero.marquee.logos} />
        </div>
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
    </Section>
  );
}

/**
 * Our Recent Clients: the gallery wall the hero's hanging prints fall onto (the visual
 * hook). The header sits on the 1200px measure; the wall runs nearly full-bleed.
 */
function Regulars() {
  return (
    <section id="regulars" aria-labelledby="regulars-h" className="relative bg-neutral-100">
      <Gridlines />
      <div className="relative z-[1] mx-auto max-w-[1200px] px-6 pt-12 md:px-8 md:pt-16">
        <SectionHeader headingId="regulars-h" eyebrow={work.eyebrow} headline={work.headline} />
      </div>
      <div className="relative z-[1] px-4 pb-24 md:px-8">
        <RegularsWall items={work.regulars} />
      </div>
    </section>
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
      <Reveal className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {caseStudies.map((c, i) => (
          <CaseStudyCard key={c.slug} c={c} featured={i === 0} />
        ))}
      </Reveal>
    </Section>
  );
}

function About() {
  return (
    <Section id="about" aria-labelledby="about-h" className="bg-orange-100">
      <SectionHeader headingId="about-h" eyebrow={about.eyebrow} headline={about.headline} />
      <Reveal className="mt-16 grid gap-8 md:grid-cols-2">
        {about.members.map((m) => (
          <div key={m.name} className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.photo}
              alt={`${m.name}, ${m.role}`}
              className="aspect-square w-full rounded-2xl object-cover grayscale"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-title-l font-medium text-neutral-1000">{m.name}</h3>
              <span className="ds-label text-label-s text-neutral-700">{m.role}</span>
              <p className="mt-2 text-body-m text-neutral-700">{m.bio}</p>
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
      <Reveal className="mt-16 flex flex-col gap-6">
        <h3 className="text-title-l font-medium text-neutral-1000">{pricing.offersHeading}</h3>
        <OfferCards offers={pricing.offers} />
      </Reveal>
    </Section>
  );
}

function Faq() {
  // The former "Why Sari Sari?" comparisons now live as FAQ entries (see site.ts `why`).
  const items = [
    ...faq.items.map((f) => ({ label: f.q, body: f.a })),
    ...why.items.map((w) => ({ label: w.title, body: w.body })),
  ];
  return (
    <Section id="faq" aria-labelledby="faq-h" className="bg-neutral-200">
      <SectionHeader headingId="faq-h" eyebrow={faq.eyebrow} headline={faq.headline} />
      <Reveal className="mt-12 max-w-[820px]">
        <Accordion items={items} defaultOpen={0} />
      </Reveal>
    </Section>
  );
}
