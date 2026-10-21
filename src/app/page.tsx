import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { Arrow, Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FooterCta } from "@/components/FooterCta";
import { Gridlines } from "@/components/Gridlines";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Placeholder } from "@/components/Placeholder";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SnackShelf } from "@/components/SnackShelf";
import { HangingShop } from "@/components/regulars/HangingShop";
import { Regulars as RegularsWall } from "@/components/regulars/Regulars";
import { type CaseStudy, caseStudies, caseStudyHref } from "@/content/case-studies";
import {
  about,
  caseStudiesSection,
  faq,
  hero,
  pricing,
  services,
  type Testimonial,
  testimonials,
  why,
  work,
} from "@/content/site";

const isExternal = (href: string) => /^https?:\/\//.test(href);

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

/** Eyebrow + serif headline (+ optional intro), the shared section-header device. */
function SectionHeader({
  eyebrow,
  headline,
  intro,
  headingId,
}: {
  eyebrow?: string;
  headline: string;
  intro?: string;
  headingId?: string;
}) {
  return (
    <Reveal className="flex max-w-[760px] flex-col gap-5">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={headingId}
        className="text-balance font-brand text-display-s leading-[1.05] text-neutral-1000"
      >
        {headline}
      </h2>
      {intro && <p className="text-body-l text-neutral-700">{intro}</p>}
    </Reveal>
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
            <Reveal className="flex max-w-[640px] flex-col gap-8">
              <h1 className="text-balance font-brand text-[clamp(40px,5vw,84px)] italic leading-[1.02] tracking-[-0.02em] text-neutral-1000">
                {active.headline}
              </h1>
              <p className="max-w-[52ch] text-body-l text-neutral-700">{hero.subhead}</p>
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
        <SnackShelf items={services.cards} />
      </Reveal>
    </Section>
  );
}

/** Our Regulars: the gallery wall the hero's hanging prints fall onto (the visual hook). */
function Regulars() {
  return (
    <Section
      id="regulars"
      aria-labelledby="regulars-h"
      className="bg-neutral-100"
      containerClassName="pt-12 md:pt-16"
    >
      <SectionHeader headingId="regulars-h" eyebrow={work.eyebrow} headline={work.headline} />
      <RegularsWall items={work.regulars} />
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
      <Reveal className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((c) => (
          <CaseStudyCard key={c.slug} c={c} />
        ))}
      </Reveal>
    </Section>
  );
}

function CaseStudyCard({ c }: { c: CaseStudy }) {
  const href = caseStudyHref(c);
  const body = (
    <>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl">
        {c.card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.card.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <Placeholder className="h-full w-full" label={`${c.client} — image pending`} />
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {/* Tags: product type, then what we helped with. Row keeps its height when empty. */}
        <ul className="flex min-h-5 flex-wrap gap-2" aria-label="Project">
          {c.card.productType && (
            <li className="ds-label rounded bg-yellow-200 px-3 py-1 text-label-s text-yellow-600">
              {c.card.productType}
            </li>
          )}
          {c.card.helpedWith.map((t) => (
            <li
              key={t}
              className="ds-label rounded border border-neutral-400 px-3 py-1 text-label-s text-neutral-700"
            >
              {t}
            </li>
          ))}
        </ul>
        <h3 className="font-brand text-[clamp(30px,2.6vw,40px)] leading-[1.1] text-neutral-1000">
          {c.client}
        </h3>
        <p className="text-body-m text-neutral-700">{c.card.outcome ?? "Case study coming soon."}</p>
        {href && (
          <span className="ds-label inline-flex items-center gap-2 text-label-m text-primary-400 group-hover:text-primary-500">
            View case study
            <Arrow />
          </span>
        )}
      </div>
    </>
  );
  return href ? (
    <Link
      href={href}
      className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary-300"
    >
      {body}
    </Link>
  ) : (
    <div>{body}</div>
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
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-title-l font-medium text-neutral-1000">{m.name}</h3>
              <span className="ds-label text-label-s text-neutral-700">{m.role}</span>
              <p className="mt-2 text-body-m text-neutral-700">{m.bio}</p>
            </div>
          </div>
        ))}
      </Reveal>
      <Reveal className="mt-16 flex max-w-[68ch] flex-col gap-6">
        <p className="text-balance font-brand text-display-s italic leading-[1.1] text-neutral-1000">
          {about.pullQuote}
        </p>
        <p className="text-body-l text-neutral-800">{about.origin}</p>
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
      {/* Masonry columns so long and short quotes pack without ragged rows. */}
      <Reveal className="mt-12 gap-6 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {testimonials.items.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </Reveal>
    </Section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  if (!t.quote) {
    return (
      <div className="mb-6 break-inside-avoid">
        <Placeholder
          className="min-h-[160px] rounded-lg"
          rounded={false}
          label={`${t.name} — quote pending`}
        />
      </div>
    );
  }
  return (
    <figure className="mb-6 flex break-inside-avoid flex-col gap-6 rounded-lg border border-neutral-300 bg-white p-8">
      <blockquote className="text-body-m text-neutral-800">“{t.quote}”</blockquote>
      <figcaption className="flex items-center gap-3">
        {t.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
        )}
        <span className="flex flex-col">
          <span className="text-title-s font-medium text-neutral-1000">{t.name}</span>
          <span className="ds-label text-label-s text-neutral-700">
            {[t.role, t.company].filter(Boolean).join(", ")}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Pricing() {
  return (
    <Section id="pricing" aria-labelledby="pricing-h" className="bg-neutral-200">
      <SectionHeader
        headingId="pricing-h"
        eyebrow={pricing.eyebrow}
        headline={pricing.headline}
        intro={pricing.intro}
      />
      <Reveal className="mt-12">
        <RetainerPanel />
      </Reveal>
      <Reveal className="mt-16 flex flex-col gap-6">
        <h3 className="text-title-l font-medium text-neutral-1000">{pricing.offersHeading}</h3>
        <ul className="grid gap-4 md:grid-cols-3">
          {pricing.offers.map((o) => (
            <li
              key={o.name}
              className="flex flex-col gap-4 rounded-lg border border-neutral-300 bg-white p-8"
            >
              <span className="ds-label text-label-s text-neutral-700">{o.name}</span>
              <div className="flex items-baseline gap-2">
                <span className="font-brand text-h1 italic leading-none text-neutral-1000">
                  {o.price}
                </span>
                {o.period && <span className="text-title-m text-neutral-700">{o.period}</span>}
              </div>
              <p className="flex-1 text-body-s text-neutral-700">{o.body}</p>
              <div>
                <Button href={o.cta.href} variant="ghost" external={isExternal(o.cta.href)}>
                  {o.cta.label}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/** The hero offer: the retainer, with its full feature list. */
function RetainerPanel() {
  const r = pricing.retainer;
  return (
    <div className="grid gap-12 rounded-2xl border border-neutral-300 bg-white p-8 md:grid-cols-2 md:p-12">
      <div className="flex flex-col gap-6">
        <span className="ds-label text-label-s text-neutral-700">{r.label}</span>
        <div className="flex items-baseline gap-2">
          <span className="font-brand text-display-m italic leading-none text-neutral-1000">
            {r.price}
          </span>
          <span className="text-title-l text-neutral-700">{r.period}</span>
        </div>
        <p className="text-body-m text-neutral-700">{r.description}</p>
        <p className="text-body-s text-neutral-700">{r.terms}</p>
        <div>
          <Button href={r.cta.href} external>
            {r.cta.label}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {r.features.map((f, i) => (
          <FeatureRow key={f.title} n={String(i + 1).padStart(2, "0")} title={f.title} body={f.body} />
        ))}
      </div>
    </div>
  );
}

function FeatureRow({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 border-b border-neutral-400 pb-6 last:border-b-0 last:pb-0">
      <span className="ds-label flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-400 text-label-s text-neutral-700">
        {n}
      </span>
      <div className="flex flex-col gap-1">
        <h4 className="text-title-m font-medium leading-6 text-neutral-1000">{title}</h4>
        <p className="text-body-s text-neutral-700">{body}</p>
      </div>
    </div>
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
