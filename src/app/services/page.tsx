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

export const metadata: Metadata = {
  title: "Services — Sari Sari Design",
  description: servicesPage.intro,
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-200">
          <PageHeader eyebrow={servicesPage.eyebrow} title={servicesPage.title} intro={servicesPage.intro} />
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
        <Section aria-labelledby="services-faq-h" className="bg-neutral-200">
          <SectionHeader headingId="services-faq-h" headline={servicesPage.faqHeading} />
          <Reveal className="mt-12 max-w-[820px]">
            <Accordion items={servicesPage.faqItems()} defaultOpen={0} />
          </Reveal>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
