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
  const { headline, scale, offers, scorecard } = homePricing;
  return (
    <div className="flex flex-col gap-12">
      <SectionHeader headingId="pricing-h" headline={headline} />

      {/* Scale */}
      <Reveal>
        <div
          id={scale.id}
          className="grid gap-12 bg-primary-400 p-8 text-neutral-100 md:p-14 lg:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            <span className="ds-label text-label text-primary-200">
              {scale.kicker}
            </span>
            <h3 className="text-heading-m text-neutral-100">{scale.name}</h3>
            <span className="font-brand text-display-s text-neutral-100">
              {scale.price}
            </span>
            <p className="text-lead text-primary-100">{scale.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button
                href={scale.cta.href}
                variant="white"
                external={isExternal(scale.cta.href)}
              >
                {scale.cta.label}
              </Button>
              <Link
                href={scale.grow.href}
                className="group ds-label inline-flex items-center gap-2 text-label text-neutral-100 underline-offset-4 hover:underline"
              >
                {scale.grow.label}
                <span aria-hidden className="line-icon nudge-x inline-block">
                  →
                </span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col">
              {scale.bullets.map((b) => (
                <li
                  key={b}
                  className="border-b border-primary-300 py-4 text-body text-neutral-100 first:pt-0"
                >
                  {b}
                </li>
              ))}
            </ul>
            <p className="text-body-s text-primary-100">{scale.bestFor}</p>
          </div>
        </div>
      </Reveal>

      {/* Offers, 3-up */}
      <Reveal
        as="ul"
        stagger
        className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12"
      >
        {offers.map((o) => (
          <li
            key={o.id}
            id={o.id}
            className="col-span-4 flex flex-col gap-4 border border-neutral-300 bg-white p-6 transition-colors duration-150 ease-out hover:border-neutral-1000 md:col-span-8 md:p-10 lg:col-span-4"
          >
            <span className="ds-label text-label text-neutral-700">
              {o.kicker}
            </span>
            <h3 className="text-heading-m text-neutral-1000">{o.name}</h3>
            <span className="font-brand text-display-s text-neutral-1000">
              {o.price}
            </span>
            <p className="text-body text-neutral-700">{o.description}</p>
            <p className="text-body-s text-neutral-700">{o.bestFor}</p>
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

      {/* Free Scorecard row */}
      <Reveal>
        <div
          id="offer-scorecard"
          className="flex flex-col gap-4 border border-dashed border-neutral-600 bg-neutral-100 p-6 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="ds-label bg-success-200 px-2 py-1 text-label text-success-600">
                {scorecard.badge}
              </span>
              <span className="ds-label text-label text-neutral-700">
                {scorecard.kicker}
              </span>
            </div>
            <h3 className="text-heading-m text-neutral-1000">
              {scorecard.name}
            </h3>
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
