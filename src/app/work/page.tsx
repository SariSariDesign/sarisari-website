import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { caseStudies } from "@/content/case-studies";
import { workIndex } from "@/content/site";

export const metadata: Metadata = {
  title: "Work — Sari Sari Design",
  description: workIndex.intro,
};

/** Case study index: every registered study; coming-soon ones render unlinked. */
export default function WorkIndex() {
  return (
    <>
      <Nav />
      <main>
        <Section className="bg-neutral-100">
          <PageHeader eyebrow={workIndex.eyebrow} title={workIndex.title} intro={workIndex.intro} />
          <Reveal className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {caseStudies.map((c, i) => (
              <CaseStudyCard key={c.slug} c={c} featured={i === 0} headingLevel="h2" />
            ))}
          </Reveal>
        </Section>
      </main>
      <FooterCta />
    </>
  );
}
