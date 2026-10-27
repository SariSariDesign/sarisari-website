import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { OfferCards } from "@/components/OfferCards";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { diagnostic } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Activation Diagnostic",
  description: diagnostic.intro,
  path: "/services/activation-diagnostic",
});

/** Overview of the diagnostic ladder (free scorecard → Audit → Diagnostic); buying happens in the app. */
export default function ActivationDiagnosticPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-200">
          <PageHeader eyebrow={diagnostic.eyebrow} title={diagnostic.title} intro={diagnostic.intro} />
          <Reveal className="mt-8">
            <Button href={diagnostic.cta.href} external>
              {diagnostic.cta.label}
            </Button>
          </Reveal>
          <Reveal className="mt-16">
            <OfferCards offers={diagnostic.tiers} />
          </Reveal>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
