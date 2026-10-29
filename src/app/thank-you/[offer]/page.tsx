import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { TrackBooking } from "@/components/TrackBooking";
import { thankYou } from "@/content/site";
import { isExternal } from "@/lib/links";

type Slug = keyof typeof thankYou.offers;
type Props = { params: Promise<{ offer: string }> };

const isSlug = (s: string): s is Slug => s in thankYou.offers;

/** One static page per Calendly event type: /thank-you/design-plus, /the-audit,
 * /the-diagnostic, /the-design-partner, /call. */
export function generateStaticParams() {
  return Object.keys(thankYou.offers).map((offer) => ({ offer }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { offer } = await params;
  const name = isSlug(offer) ? thankYou.offers[offer].name : "your call";
  return {
    title: `Booked: ${name}`,
    // Conversion pages: keep them out of search results.
    robots: { index: false, follow: false },
  };
}

/**
 * Calendly redirects here after a booking (set per event type: Booking page options →
 * Confirmation page → Redirect to an external site). GTM counts the conversion two ways:
 * a page view on /thank-you/<offer>, and a `booking_confirmed` dataLayer event with the offer.
 */
export default async function ThankYouPage({ params }: Props) {
  const { offer } = await params;
  if (!isSlug(offer)) notFound();
  const o = thankYou.offers[offer];
  return (
    <>
      <Nav />
      <TrackBooking offer={offer} />
      <main>
        <Section className="bg-neutral-100">
          <PageHeader eyebrow={o.name} title={thankYou.title} intro={thankYou.intro} />
          {/* Prep checklist for this call, then the Scorecard nudge. */}
          <div className="mt-12 flex max-w-[640px] flex-col gap-4">
            <h2 className="text-heading-m text-neutral-1000">{thankYou.prepHeading}</h2>
            <ol className="flex flex-col">
              {o.prep.map((item, i) => (
                <li
                  key={item}
                  className="grid grid-cols-[1.5rem_1fr] gap-x-6 border-t border-neutral-300 py-4"
                >
                  <span className="ds-label self-center text-label text-neutral-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body text-neutral-1000">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-10 flex flex-col items-start gap-6">
            <p className="max-w-[56ch] text-body text-neutral-700">{thankYou.next}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={thankYou.primary.href} external={isExternal(thankYou.primary.href)}>
                {thankYou.primary.label}
              </Button>
              <Button href={thankYou.secondary.href} variant="secondary">
                {thankYou.secondary.label}
              </Button>
            </div>
          </div>
        </Section>
      </main>
      <FooterCta cta={false} />
    </>
  );
}
