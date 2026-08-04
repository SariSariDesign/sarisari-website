import Link from "next/link";
import { footer, footerCta } from "@/content/site";
import { Button } from "./Button";
import { Wordmark } from "./Wordmark";

/** Closing navy CTA band + the dark footer, per comp. Shared across all pages. */
export function FooterCta() {
  return (
    <>
      <section aria-labelledby="cta-h" className="bg-primary-600 text-neutral-100">
        <div className="mx-auto max-w-[1200px] px-6 py-28 md:px-8 md:py-36">
          <div className="flex max-w-[68ch] flex-col gap-6">
            <h2
              id="cta-h"
              className="text-balance font-brand text-display-m italic leading-[1.05] text-neutral-100"
            >
              {footerCta.headline}
            </h2>
            <p className="text-body-l text-primary-200">{footerCta.subhead}</p>
            <div className="mt-2">
              <Button href={footerCta.cta.href} variant="white" external>
                {footerCta.cta.label}
              </Button>
            </div>
            <span className="ds-label mt-4 text-label-m text-primary-300">{footerCta.slots}</span>
          </div>
        </div>
      </section>

      <footer className="bg-neutral-1000 text-neutral-500">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <Wordmark className="text-title-l text-neutral-100" />
          <div className="ds-label flex flex-wrap items-center gap-x-8 gap-y-2 text-label-m">
            {footer.links.map((l) => (
              <Link key={l.label} href={l.href} className="text-neutral-400 hover:text-neutral-100">
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
