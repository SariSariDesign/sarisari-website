import Link from "next/link";
import { footer, footerCta } from "@/content/site";
import { Button } from "./Button";
import { Gridlines } from "./Gridlines";
import { Wordmark } from "./Wordmark";

/** Closing blue (primary-400) CTA band (grain, display-l) + the footer. Shared across all pages. */
/** `cta={false}` drops the blue band and keeps only the footer (thank-you pages). */
export function FooterCta({ cta = true }: { cta?: boolean } = {}) {
  return (
    <>
      {cta && (
      <section
        aria-labelledby="cta-h"
        className="grain snap-start bg-primary-400 text-neutral-100"
        data-dark-band
      >
        <Gridlines tone="dark" />
        <div className="measure relative z-[1] py-28 md:py-36">
          <div className="flex flex-col gap-6">
            <h2
              id="cta-h"
              className="max-w-[18ch] text-balance font-brand text-display-l text-neutral-100"
            >
              {footerCta.headline}
            </h2>
            <p className="max-w-[48ch] text-lead text-primary-100">
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
      )}

      <footer className="bg-neutral-1000 text-neutral-500">
        {/* Row 1: wordmark. Row 2: contact links left, legal + copyright right. */}
        <div className="measure flex flex-col gap-8 py-10">
          <Wordmark className="self-start text-[24px] text-neutral-100" />
          <div className="ds-label flex flex-col gap-4 text-label md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {footer.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`text-neutral-400 hover:text-neutral-100`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {footer.legal.map((l) => (
                <Link key={l.label} href={l.href} className="text-neutral-400 hover:text-neutral-100">
                  {l.label}
                </Link>
              ))}
              <span className="text-neutral-600">{footer.copyright}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
