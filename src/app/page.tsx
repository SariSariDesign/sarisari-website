import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { Placeholder } from "@/components/Placeholder";
import { Section } from "@/components/Section";
import {
  approach,
  differentiator,
  faq,
  hero,
  pricing,
  services,
  team,
  testimonials,
  work,
} from "@/content/site";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Differentiator />
        <Work />
        <Services />
        <Approach />
        <Testimonials />
        <Team />
        <Pricing />
        <Faq />
      </main>
      <FooterCta />
    </>
  );
}

function Hero() {
  return (
    <Section gridlines className="bg-neutral-100">
      <div className="flex min-h-[60vh] flex-col justify-center gap-6 py-10">
        <span className="ds-label text-label-l text-neutral-900">{hero.eyebrow}</span>
        <h1 className="max-w-[1069px] font-brand text-[clamp(44px,7vw,120px)] leading-[1.0] tracking-[-0.02em] text-neutral-800">
          {hero.headline.pre}
          <em>{hero.headline.em}</em>
          {hero.headline.post}
        </h1>
        <p className="text-body-l text-neutral-900">{hero.subhead}</p>
        <div className="mt-2">
          <Button href={hero.cta.href}>{hero.cta.label}</Button>
        </div>
      </div>
      {/* logo marquee row — assets pending (asset-inventory.md) */}
      <div className="grid grid-cols-3 gap-4 border-t border-neutral-300 pt-8 md:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-20 border border-neutral-300" aria-hidden />
        ))}
      </div>
    </Section>
  );
}

function Differentiator() {
  return (
    <Section id="about" index={differentiator.index} noise className="bg-primary-400">
      <div className="grid gap-16 lg:grid-cols-2">
        <h2 className="font-brand text-display-s text-neutral-300">{differentiator.headline}</h2>
        <div className="flex flex-col gap-6">
          <div className="bg-primary-500/40 p-3">
            <Placeholder tone="blue" className="aspect-[552/360] w-full" />
          </div>
          {differentiator.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-body-l text-neutral-200">
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Work() {
  const cards = [...work.projects];
  return (
    <Section id="work" index={work.index} className="bg-neutral-100">
      <h2 className="mb-16 max-w-[576px] font-brand text-display-s text-primary-400">
        {work.headline}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
        <CtaCard />
      </div>
    </Section>
  );
}

function ProjectCard(p: (typeof work.projects)[number]) {
  const body = (
    <div className="flex flex-col gap-6">
      <Placeholder className="aspect-square w-full" label={p.title} />
      <div className="flex flex-col gap-4 px-1">
        <h3 className="text-title-l font-medium text-neutral-900 group-hover:text-primary-400">
          {p.title}
        </h3>
        <dl className="flex flex-col gap-2">
          <Prop label="Year" value={p.year} />
          <Prop label="Project Type" value={p.type} />
          <Prop label="Industry" value={p.industry} />
        </dl>
      </div>
    </div>
  );
  return p.href ? (
    <Link href={p.href} className="group">
      {body}
    </Link>
  ) : (
    <div>{body}</div>
  );
}

function CtaCard() {
  return (
    <Link href={work.ctaCard.href} className="group">
      <div className="flex flex-col gap-6">
        <div className="flex aspect-square w-full items-center justify-center bg-primary-500 transition-colors group-hover:bg-primary-600">
          <span aria-hidden className="text-7xl font-light text-primary-100">+</span>
        </div>
        <div className="flex flex-col gap-4 px-1">
          <h3 className="text-title-l font-medium text-primary-400">{work.ctaCard.title}</h3>
          <dl className="flex flex-col gap-2">
            <Prop label="Year" value={work.ctaCard.year} />
            <Prop label="Project Type" value="Yours" />
            <Prop label="Industry" value="You tell us" />
          </dl>
        </div>
      </div>
    </Link>
  );
}

function Prop({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="ds-label text-label-m text-neutral-700">{label}</dt>
      <dd className="text-body-m font-bold text-neutral-900">{value}</dd>
    </div>
  );
}

function Services() {
  return (
    <Section id="services" index={services.index} noise className="bg-primary-400">
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <h2 className="font-brand text-display-s text-neutral-300">{services.headline}</h2>
          <p className="text-body-l text-neutral-200">{services.aside}</p>
          <div>
            <Button href={services.cta.href} size="medium">
              {services.cta.label}
            </Button>
          </div>
        </div>
        <Accordion items={services.items} tone="blue" defaultOpen={1} />
      </div>
    </Section>
  );
}

function Approach() {
  return (
    <Section id="process" index={approach.index} className="bg-neutral-200">
      <div className="grid gap-16 lg:grid-cols-2">
        <h2 className="font-brand text-display-s text-neutral-800">{approach.headline}</h2>
        <div className="flex flex-col gap-6">
          {approach.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-body-l text-neutral-900">
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section index={testimonials.index} className="bg-neutral-100">
      <h2 className="mb-16 font-brand text-display-s text-neutral-800">{testimonials.headline}</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.reviews.map((r) => (
          <figure key={r.name} className="flex flex-col gap-4">
            <div className="ds-label flex items-center justify-between text-label-l text-neutral-700">
              <span>{r.date}</span>
              <span aria-hidden>→</span>
            </div>
            <Placeholder className="aspect-square w-full" label={r.name} />
            <blockquote className="text-body-m text-neutral-900">“{r.quote}”</blockquote>
            <figcaption className="ds-label text-label-m text-neutral-700">
              {r.name} · {r.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Team() {
  return (
    <Section index={team.index} noise className="bg-success-400">
      <h2 className="mb-16 max-w-[700px] font-brand text-display-s text-neutral-300">
        {team.headline}
      </h2>
      <div className="grid gap-12 md:grid-cols-2">
        {team.members.map((m) => (
          <div key={m.name} className="flex flex-col gap-6">
            <div className="bg-success-500/40 p-3">
              <Placeholder tone="green" className="aspect-square w-full" label={m.name} />
            </div>
            <h3 className="font-brand text-h2 italic text-success-200">{m.name}</h3>
            <p className="text-body-m text-neutral-200">{m.bio}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Pricing() {
  return (
    <Section id="pricing" index={pricing.index} className="bg-neutral-100">
      <h2 className="mb-16 max-w-[800px] font-brand text-display-m text-neutral-800">
        {pricing.headline}
      </h2>
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="flex max-w-[379px] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="ds-label text-label-l text-neutral-900">{pricing.label}</span>
            <p className="font-brand text-h1 text-neutral-900">{pricing.price}</p>
          </div>
          <p className="text-body-m text-neutral-700">{pricing.body}</p>
          <div>
            <Button href={pricing.cta.href}>{pricing.cta.label}</Button>
          </div>
        </div>
        <Accordion items={pricing.included} defaultOpen={1} />
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section id="faq" index={faq.index} className="bg-neutral-200">
      <div className="grid gap-16 lg:grid-cols-[1fr_576px]">
        <div className="flex flex-col gap-6">
          <h2 className="font-brand text-display-s text-neutral-900">{faq.headline}</h2>
          <div>
            <Button href={faq.cta.href} variant="ghost" size="medium">
              {faq.cta.label}
            </Button>
          </div>
        </div>
        <Accordion items={faq.items.map((f) => ({ label: f.q, body: f.a }))} />
      </div>
    </Section>
  );
}
