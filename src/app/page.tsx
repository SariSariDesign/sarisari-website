import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { CaseStudyCard } from "@/components/CaseStudyCard";
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
  const active = hero.headlineOptions[hero.activeHeadline];
  return (
    // A "moment": grain on, gridlines off. At lg the hero stops ~150px short of the
    // viewport bottom so the next section peeks in on landing (76px = sticky nav height).
    <section id="hero" data-hero className="grain overflow-hidden bg-neutral-100 lg:min-h-[max(620px,calc(100svh-76px-150px))]">
      <div className="relative z-[1] flex h-full flex-col">
        <div className="measure grid min-h-0 flex-1 grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-full flex items-center pb-12 pt-16 md:pt-24 lg:col-span-6 lg:py-12">
            {/* Load sequence: headline +80ms, subhead +180ms, CTAs +280ms (eyebrow, when added, 0ms). */}
            <div className="hero-seq flex flex-col gap-8">
              <h1
                className="text-balance font-brand text-[clamp(52px,8vw,var(--text-display-l))] italic leading-[1] tracking-[-0.02em] text-neutral-1000"
                style={{ "--d": "80ms" } as React.CSSProperties}
              >
                {active.headline}
              </h1>
              <p
                className="max-w-[40ch] text-body-l text-neutral-700"
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
          </div>

          <div className="relative col-span-full pb-12 lg:col-span-6 lg:pb-0 lg:pt-6">
            <HangingShop />
          </div>
        </div>

        {/* Label and logo strip both sit inside the 1200px measure. */}
        <div className="measure flex flex-col gap-8 pb-16 pt-8 md:pb-24 lg:pb-12 lg:pt-20">
          <span className="ds-label text-[15px] leading-[18px] tracking-[2px] text-neutral-700">
            {hero.marquee.label}
          </span>
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
      <Reveal className="mt-8">
        <Button href={pricing.compare.href} variant="ghost">
          {pricing.compare.label}
        </Button>
      </Reveal>
      <Reveal className="mt-16 flex flex-col gap-4">
        <h3 className="text-title-l font-medium text-neutral-1000">{pricing.offersHeading}</h3>
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
      <Reveal className="cols-8 mt-12">
        <Accordion items={items} defaultOpen={0} />
      </Reveal>
    </Section>
  );
}
