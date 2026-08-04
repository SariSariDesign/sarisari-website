import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FooterCta } from "@/components/FooterCta";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Placeholder } from "@/components/Placeholder";
import { PricingTabs } from "@/components/PricingTabs";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import {
  about,
  type CaseStudy,
  faq,
  hero,
  pricing,
  process,
  services,
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
        <Services />
        <Work />
        <Process />
        <Why />
        <About />
        <Pricing />
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
  eyebrow: string;
  headline: string;
  intro?: string;
  headingId?: string;
}) {
  return (
    <Reveal className="flex max-w-[760px] flex-col gap-5">
      <Eyebrow>{eyebrow}</Eyebrow>
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
    <Section className="bg-neutral-100" containerClassName="pb-24 pt-16 md:pt-24">
      <Reveal
        className={`flex flex-col gap-8 ${active.centered ? "mx-auto max-w-[900px] items-center text-center" : "max-w-[900px]"}`}
      >
        <h1 className="text-balance font-brand text-[clamp(44px,8vw,120px)] italic leading-[1.0] tracking-[-0.02em] text-neutral-1000">
          {active.headline}
        </h1>
        <p className="max-w-[60ch] text-body-l text-neutral-700">{hero.subhead}</p>
        <div className={`flex flex-wrap gap-4 ${active.centered ? "justify-center" : ""}`}>
          {hero.ctas.map((cta) => (
            <Button key={cta.label} href={cta.href} variant={cta.variant} external={isExternal(cta.href)}>
              {cta.label}
            </Button>
          ))}
        </div>
        <p className="max-w-[60ch] text-body-m text-neutral-600">{hero.finePrint}</p>
      </Reveal>

      <div className="mt-24 flex flex-col gap-6">
        <span className="ds-label text-label-s text-neutral-600">{hero.marquee.label}</span>
        <Marquee items={hero.marquee.logos} />
      </div>
    </Section>
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
      <Reveal className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.cards.map((c) => (
          <div
            key={c.title}
            className="flex flex-col gap-4 rounded-lg border border-neutral-300 bg-white p-8"
          >
            <span className="ds-label text-label-s text-neutral-600">{c.n}</span>
            <h3 className="text-title-l font-medium text-neutral-1000">{c.title}</h3>
            <p className="text-body-s text-neutral-700">{c.body}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

function Work() {
  return (
    <Section id="work" aria-labelledby="work-h" className="bg-neutral-100">
      <SectionHeader headingId="work-h" eyebrow={work.eyebrow} headline={work.headline} />
      <div className="mt-16 flex flex-col gap-24">
        {work.cases.map((c, i) => (
          <CaseRow key={c.client} c={c} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}

function CaseRow({ c, flip }: { c: CaseStudy; flip: boolean }) {
  return (
    <Reveal className="grid items-center gap-12 lg:grid-cols-2">
      <Placeholder
        className={`aspect-[4/3] w-full ${flip ? "lg:order-2" : ""}`}
        label={`${c.client} — asset pending`}
      />
      <div className={`flex flex-col gap-5 ${flip ? "lg:order-1" : ""}`}>
        <span className="ds-label w-fit rounded bg-yellow-200 px-3 py-1 text-label-s text-yellow-600">
          {c.sector}
        </span>
        <h3 className="font-brand text-[clamp(32px,4vw,48px)] leading-[1.1] text-neutral-1000">
          {c.client}
        </h3>
        <p className="text-body-m text-neutral-700">{c.problem}</p>
        <p className="text-body-m text-neutral-700">{c.approach}</p>
        <div className="flex items-baseline gap-3">
          <span className="font-brand text-display-s italic leading-none text-orange-500">
            {c.metric}
          </span>
          <span className="ds-label text-label-s text-neutral-600">{c.metricLabel}</span>
        </div>
        {c.stats.length > 0 && (
          <dl className="grid grid-cols-3 gap-4 border-t border-neutral-300 pt-5">
            {c.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="order-2 ds-label text-label-s text-neutral-600">{s.label}</dt>
                <dd className="order-1 text-title-m font-medium text-neutral-1000">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {c.testimonial && (
          <blockquote className="border-l-2 border-neutral-400 pl-4">
            <p className="text-body-m text-neutral-800">“{c.testimonial.quote}”</p>
            <cite className="ds-label mt-2 block text-label-s not-italic text-neutral-600">
              {c.testimonial.attribution}
            </cite>
          </blockquote>
        )}
        <div>
          <Button href={c.href} variant="ghost">
            View case study
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

function Process() {
  return (
    <Section aria-labelledby="process-h" className="bg-neutral-200">
      <SectionHeader
        headingId="process-h"
        eyebrow={process.eyebrow}
        headline={process.headline}
        intro={process.intro}
      />
      <Reveal className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((s) => (
          <div key={s.n} className="flex flex-col gap-4 border-t border-neutral-400 pt-6">
            <span className="font-brand text-h1 leading-none text-orange-300">{s.n}</span>
            <h3 className="text-title-l font-medium text-neutral-1000">{s.title}</h3>
            <p className="text-body-s text-neutral-700">{s.body}</p>
            <span className="ds-label mt-2 text-label-s text-neutral-600">{s.when}</span>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

function Why() {
  return (
    <Section aria-labelledby="why-h" className="bg-neutral-100">
      <SectionHeader headingId="why-h" eyebrow={why.eyebrow} headline={why.headline} />
      <Reveal className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
        {why.items.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <h3 className="text-title-m font-medium text-neutral-1000">{item.title}</h3>
            <p className="max-w-[52ch] text-body-m text-neutral-700">{item.body}</p>
          </div>
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
            <Placeholder className="aspect-square w-full" label={m.name} />
            <div className="flex flex-col gap-1">
              <h3 className="text-title-l font-medium text-neutral-1000">{m.name}</h3>
              <span className="ds-label text-label-s text-neutral-600">{m.role}</span>
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

function Pricing() {
  return (
    <Section id="pricing" aria-labelledby="pricing-h" className="bg-neutral-100">
      <SectionHeader
        headingId="pricing-h"
        eyebrow={pricing.eyebrow}
        headline={pricing.headline}
        intro={pricing.intro}
      />
      <Reveal className="mt-12">
        <PricingTabs
          labels={{ retainer: pricing.tabs.retainer, diagnostic: pricing.tabs.diagnostic }}
          retainer={<RetainerPanel />}
          diagnostic={<DiagnosticPanel />}
        />
      </Reveal>
    </Section>
  );
}

function RetainerPanel() {
  const r = pricing.retainer;
  return (
    <div className="grid gap-12 rounded-2xl bg-neutral-200 p-8 md:grid-cols-2 md:p-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline gap-2">
          <span className="font-brand text-display-m italic leading-none text-neutral-1000">
            {r.price}
          </span>
          <span className="text-title-l text-neutral-700">{r.period}</span>
        </div>
        <p className="text-body-m text-neutral-700">{r.description}</p>
        <p className="text-body-s text-neutral-600">{r.terms}</p>
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

function DiagnosticPanel() {
  const d = pricing.diagnostic;
  return (
    <div className="grid gap-12 rounded-2xl border border-neutral-300 bg-white p-8 md:grid-cols-2 md:p-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="ds-label rounded-full bg-orange-100 px-3 py-1 text-label-s text-orange-600">
            {d.tag}
          </span>
          <span className="ds-label text-label-s text-neutral-600">{d.label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-brand text-display-m italic leading-none text-neutral-1000">
            {d.price}
          </span>
          <span className="text-title-l text-neutral-700">{d.period}</span>
        </div>
        <h3 className="text-title-l font-medium text-neutral-1000">{d.headline}</h3>
        <p className="text-body-m text-neutral-700">{d.description}</p>
        <div>
          <Button href={d.cta.href} variant="ghost" external>
            {d.cta.label}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {d.rows.map((row, i) => (
          <FeatureRow
            key={row.title}
            n={String(i + 1).padStart(2, "0")}
            title={row.title}
            body={row.body}
          />
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
  return (
    <Section id="faq" aria-labelledby="faq-h" className="bg-neutral-200">
      <SectionHeader headingId="faq-h" eyebrow={faq.eyebrow} headline={faq.headline} />
      <Reveal className="mt-12 max-w-[820px]">
        <Accordion items={faq.items.map((f) => ({ label: f.q, body: f.a }))} defaultOpen={0} />
      </Reveal>
    </Section>
  );
}
