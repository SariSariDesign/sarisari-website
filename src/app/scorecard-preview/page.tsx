import Link from "next/link";
import { ScorecardForm } from "@/components/scorecard/ScorecardForm";
import { Section } from "@/components/Section";
import { Wordmark } from "@/components/Wordmark";
import { scorecard } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

// Standalone lead-magnet page: no site nav, so nothing competes with the form.
export const metadata = pageMetadata({ ...scorecard.page.meta, path: "/scorecard-preview" });

export default function ScorecardPreviewPage() {
  return (
    <main>
      <Section hug gridlines={false} className="bg-neutral-100">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-10">
          <Link href="/" aria-label="Sari Sari Design home" className="w-fit">
            <Wordmark className="text-[22px] text-neutral-1000" />
          </Link>
          <ScorecardForm />
        </div>
      </Section>
    </main>
  );
}
