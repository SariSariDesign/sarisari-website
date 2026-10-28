import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { BOOKING_URL, contact } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: contact.intro,
  path: "/contact",
});

/** Primary: book a call (Calendly inline). Ghost: Say Hello form → Attio. */
export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-100">
          <PageHeader eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro} />
        </Section>
        <Section aria-labelledby="book-h" className="bg-neutral-100">
          <div className="flex flex-col gap-6">
            <SectionHeader headingId="book-h" headline={contact.bookingHeading} />
            <iframe
              src={contact.bookingEmbed}
              title="Book a call with Sari Sari"
              loading="lazy"
              className="h-[720px] w-full rounded border border-neutral-300 bg-white"
            />
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-body-s text-primary-400 underline">
              Calendar not loading? Open it in Calendly.
            </a>
          </div>
        </Section>
        <Section aria-labelledby="hello-h" className="bg-neutral-100">
          <SectionHeader headingId="hello-h" headline={contact.form.heading} />
          <div className="mt-10">
            <ContactForm />
          </div>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
