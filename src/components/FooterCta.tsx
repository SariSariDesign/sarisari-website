import Link from "next/link";
import { footer } from "@/content/site";
import { Button } from "./Button";
import { Wordmark } from "./Wordmark";

/** Blue footer CTA band with link columns and the oversized wordmark, per comp. */
export function FooterCta() {
  return (
    <footer className="noise relative overflow-hidden bg-primary-400 text-primary-100">
      <div className="relative mx-auto max-w-[1200px] px-6 pb-0 pt-24 md:pt-32 lg:px-4">
        <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-[576px] flex-col gap-8">
            <h2 className="font-brand text-display-s text-primary-100">{footer.headline}</h2>
            <div>
              <Button href={footer.cta.href} variant="light">
                {footer.cta.label}
              </Button>
            </div>
          </div>
          <div className="ds-label flex gap-16 text-label-l">
            {footer.columns.map((col, i) => (
              <ul key={i} className="flex flex-col gap-4">
                {col.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link href={link.href} className="text-primary-300 hover:text-primary-200">
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-primary-300">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="mt-20 overflow-hidden" aria-hidden>
          <Wordmark className="block translate-y-[18%] text-[clamp(80px,16vw,250px)] text-primary-300/80" />
        </div>
      </div>
    </footer>
  );
}
