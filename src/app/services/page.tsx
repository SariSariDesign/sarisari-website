import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { OfferCards } from "@/components/OfferCards";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesList } from "@/components/ServicesList";
import { services, servicesPage } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description: servicesPage.intro,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-100">
          <PageHeader eyebrow={servicesPage.eyebrow} title={servicesPage.title} intro={servicesPage.intro} />
          <h2 className="sr-only">{servicesPage.listHeading}</h2>
          <Reveal>
            <ServicesList items={services.cards} />
          </Reveal>
        </Section>
        <Section aria-labelledby="offers-h" className="bg-neutral-100">
          <SectionHeader headingId="offers-h" headline={servicesPage.offersHeading} />
          <Reveal className="mt-12">
            <OfferCards offers={servicesPage.offers} />
          </Reveal>
        </Section>
        <Section aria-labelledby="services-faq-h" className="bg-neutral-100">
          <SectionHeader headingId="services-faq-h" headline={servicesPage.faqHeading} />
          <Reveal className="mt-12">
            <Accordion items={servicesPage.faqItems()} defaultOpen={0} />
          </Reveal>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
