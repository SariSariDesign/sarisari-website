import Link from "next/link";
import { footer, footerCta } from "@/content/site";
import { Button } from "./Button";
import { Wordmark } from "./Wordmark";

/** Closing near-black CTA band (grain, display-l) + the footer. Shared across all pages. */
export function FooterCta() {
  return (
    <>
      <section
        aria-labelledby="cta-h"
        className="grain grain-dark snap-start bg-neutral-1000 text-neutral-100"
        data-dark-band
      >
        <div className="measure relative z-[1] py-28 md:py-36">
          <div className="flex flex-col gap-6">
            <h2
              id="cta-h"
              className="max-w-[18ch] text-balance font-brand text-display-l text-neutral-100"
            >
              {footerCta.headline}
            </h2>
            <p className="max-w-[48ch] text-lead text-neutral-400">
              {footerCta.subhead}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button href={footerCta.cta.href} variant="white" external>
                {footerCta.cta.label}
              </Button>
              <Button
                href={footerCta.secondary.href}
                variant="outline-light"
                external
              >
                {footerCta.secondary.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-neutral-1000 text-neutral-500">
        <div className="measure flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <Wordmark className="text-[24px] text-neutral-100" />
          <div className="ds-label flex flex-wrap items-center gap-x-4 gap-y-2 text-label">
            {footer.links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-neutral-400 hover:text-neutral-100"
              >
                {l.label}
              </Link>
            ))}
            <span className="text-neutral-600">{footer.copyright}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
