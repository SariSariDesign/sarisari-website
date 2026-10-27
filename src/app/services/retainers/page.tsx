import type { Metadata } from "next";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { RetainerPanel } from "@/components/RetainerPanel";
import { Section } from "@/components/Section";
import { retainers } from "@/content/site";

export const metadata: Metadata = {
  title: "Retainers — Sari Sari Design",
  description: retainers.intro,
};

/** Grow vs Scale, one RetainerPanel per tier. */
export default function RetainersPage() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-200">
          <PageHeader eyebrow={retainers.eyebrow} title={retainers.title} intro={retainers.intro} />
          <div className="mt-16 flex flex-col gap-8">
            {retainers.tiers.map((t) => (
              <Reveal key={t.name}>
                <RetainerPanel retainer={t} />
              </Reveal>
            ))}
          </div>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
