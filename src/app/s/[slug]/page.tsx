import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/scorecard/store.supabase";
import { isPreviewReport } from "@/lib/scorecard/report";
import { PreviewReport } from "@/components/scorecard/report/PreviewReport";
import { LegacyScorecardReport } from "@/components/scorecard/report/LegacyScorecardReport";
import type { LegacyScorecardResult } from "@/lib/scorecard/legacy-types";

/**
 * Hosted Activation Scorecard Preview, rendered at request time from the row
 * stored under this unguessable slug. Every preview, self-serve or operator, is
 * served here. Held operator runs render too so the founder can review the exact
 * page before approving the email. Kept out of search (X-Robots-Tag header in
 * next.config.mjs plus metadata below).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Activation Scorecard Preview",
  robots: { index: false, follow: false },
};

export default async function ScorecardReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getStore().getBySlug(slug).catch(() => null);
  if (!row) notFound();

  if (isPreviewReport(row.result)) return <PreviewReport slug={row.slug} report={row.result} />;
  if (row.status === "failed") notFound();
  return (
    <LegacyScorecardReport
      lead={{ name: row.name, company: row.company, email: row.email, stage: row.stage, url: row.url, domain: row.domain }}
      result={row.result as LegacyScorecardResult}
    />
  );
}
