import Link from "next/link";
import { homePricing } from "@/content/site";
import { isExternal } from "@/lib/links";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Homepage pricing: headline, the Scale card (full width, the one primary-400 surface),
 * three offer cards 3-up, and the free Scorecard row (dashed). 48px between each block.
 * Every card carries an id so the use-case buttons can scroll to and highlight it.
 */
export function HomePricing() {
  const { headline, scale, offers, offersHeading, scorecard } = homePricing;
  return (
    <div className="flex flex-col gap-12">
      <SectionHeader headingId="pricing-h" headline={headline} />

      {/* Scale */}
      <Reveal>
        <div
          id={scale.id}
          className="grid gap-12 rounded bg-primary-400 p-8 text-neutral-100 md:p-14 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            <span className="ds-label text-label text-primary-100">{scale.kicker}</span>
            <h3 className="text-heading-m text-neutral-100">{scale.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-brand text-display-s text-neutral-100">{scale.price}</span>
              <span className="text-lead text-primary-100">{scale.period}</span>
            </div>
            <div className="mt-2 flex flex-col items-start gap-4">
              <Button href={scale.cta.href} variant="white" external={isExternal(scale.cta.href)}>
                {scale.cta.label}
              </Button>
              <Link
                href={scale.grow.href}
                className="group ds-label inline-flex items-center gap-2 text-label text-neutral-100 underline underline-offset-4"
              >
                {scale.grow.label}
                <span aria-hidden className="line-icon nudge-x inline-block">
                  →
                </span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="ds-label text-label text-primary-100">{scale.bestFor}</p>
            <ol className="flex flex-col">
              {scale.features.map((f, i) => (
                <li key={f.title} className="flex gap-6 border-t border-primary-300 py-4">
                  <span className="ds-label w-6 shrink-0 pt-1 text-label text-primary-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-heading-m text-neutral-100">{f.title}</span>
                    {f.body && <span className="text-body-s text-primary-100">{f.body}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      {/* Offers, 3-up, under their heading */}
      <div className="flex flex-col gap-6">
        <Reveal>
          <h3 className="text-heading-m text-neutral-1000">{offersHeading}</h3>
        </Reveal>
        <Reveal
          as="ul"
          stagger
          className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12"
        >
          {offers.map((o) => (
            <li
              key={o.id}
              id={o.id}
              className="col-span-4 flex flex-col gap-4 rounded border border-neutral-300 bg-white p-6 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-100 md:col-span-8 md:p-10 lg:col-span-4"
            >
              <span className="ds-label text-label text-neutral-700">
                {o.kicker}
              </span>
              <h4 className="text-heading-m text-neutral-1000">{o.name}</h4>
              <span className="font-brand text-display-s text-neutral-1000">
                {o.price}
              </span>
              <p className="text-body text-neutral-700">{o.description}</p>
              <p className="ds-label text-label text-neutral-700">{o.bestFor}</p>
              {"note" in o && o.note && (
                <p className="text-body-s text-neutral-1000">{o.note}</p>
              )}
              <div className="mt-auto pt-2">
                <Button
                  href={o.cta.href}
                  variant="secondary"
                  size="medium"
                  external={isExternal(o.cta.href)}
                >
                  {o.cta.label}
                </Button>
              </div>
            </li>
          ))}
        </Reveal>
      </div>

      {/* Free Scorecard row */}
      <Reveal>
        <div
          id="offer-scorecard"
          className="flex flex-col gap-4 rounded border border-dashed border-neutral-600 bg-neutral-100 p-6 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-200 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="ds-label rounded bg-success-200 px-2 py-1 text-label text-success-600">
                {scorecard.badge}
              </span>
              <span className="ds-label text-label text-neutral-700">
                {scorecard.kicker}
              </span>
            </div>
            <h3 className="text-heading-m text-neutral-1000">
              {scorecard.name}
            </h3>
            <span className="font-brand text-display-s text-neutral-1000">
              {scorecard.price}
            </span>
            <p className="max-w-[60ch] text-body text-neutral-700">
              {scorecard.description}
            </p>
          </div>
          <div className="shrink-0">
            <Button
              href={scorecard.cta.href}
              external={isExternal(scorecard.cta.href)}
            >
              {scorecard.cta.label}
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
