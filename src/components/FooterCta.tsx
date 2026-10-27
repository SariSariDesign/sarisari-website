import Link from "next/link";
import { footer, footerCta } from "@/content/site";
import { Button } from "./Button";
import { Wordmark } from "./Wordmark";

/** Closing navy CTA band + the dark footer, per comp. Shared across all pages. */
export function FooterCta() {
  return (
    <>
      <section aria-labelledby="cta-h" className="grain bg-primary-600 text-neutral-100">
        <div className="measure relative z-[1] py-28 md:py-36">
          <div className="cols-8 flex flex-col gap-6">
            <h2
              id="cta-h"
              className="text-balance font-brand text-[clamp(52px,8vw,var(--text-display-l))] italic leading-[1] tracking-[-0.02em] text-neutral-100"
            >
              {footerCta.headline}
            </h2>
            <p className="text-body-m text-primary-200">{footerCta.subhead}</p>
            <div className="mt-2">
              <Button href={footerCta.cta.href} variant="white" external>
                {footerCta.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-neutral-1000 text-neutral-500">
        <div className="measure flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <Wordmark className="text-title-l text-neutral-100" />
          <div className="ds-label flex flex-wrap items-center gap-x-4 gap-y-2 text-label-m">
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
