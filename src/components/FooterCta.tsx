import Link from "next/link";
import type { CtaContent } from "@/content/case-studies/types";
import { footer, footerCta } from "@/content/site";
import { isExternal } from "@/lib/links";
import { Button } from "./Button";
import { Gridlines } from "./Gridlines";
import { Wordmark } from "./Wordmark";

/** Closing blue (primary-400) CTA band (grain, display-l) + the footer. Shared across all pages. */
/** `cta={false}` drops the blue band and keeps only the footer (thank-you pages).
 *  `content` swaps the band's copy and buttons (case studies speak to their own problem). */
export function FooterCta({
  cta = true,
  content,
}: { cta?: boolean; content?: CtaContent } = {}) {
  const c: CtaContent = content ?? {
    headline: footerCta.headline,
    subhead: footerCta.subhead,
    primary: footerCta.cta,
    secondary: footerCta.secondary,
  };
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
              {c.headline}
            </h2>
            <p className="max-w-[48ch] text-lead text-primary-100">
              {c.subhead}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button href={c.primary.href} variant="white" external={isExternal(c.primary.href)}>
                {c.primary.label}
              </Button>
              {c.secondary && (
                <Button
                  href={c.secondary.href}
                  variant="outline-light"
                  external={isExternal(c.secondary.href)}
                >
                  {c.secondary.label}
                </Button>
              )}
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
