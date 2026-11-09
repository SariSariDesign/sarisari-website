import type { ReactNode } from "react";
import { FooterCta } from "@/components/FooterCta";
import { Nav } from "@/components/Nav";

export type LegalSection = { heading: string; body: ReactNode };

/** Shared layout for /privacy and /terms: title, effective date, then numbered sections. */
export function LegalPage({
  title,
  effectiveDate,
  intro,
  sections,
}: {
  title: string;
  effectiveDate: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <Nav />
      <main className="measure py-24 [&>*]:max-w-[760px]">
        <h1 className="mb-4 font-brand text-display-m text-neutral-900">{title}</h1>
        <p className="mb-8 text-body-s text-neutral-600">Effective {effectiveDate}</p>
        <div className="mb-12 text-body text-neutral-700">{intro}</div>
        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="mb-3 text-heading-m text-neutral-900">
                {i + 1}. {s.heading}
              </h2>
              <div className="flex flex-col gap-3 text-body text-neutral-700 [&_a]:text-primary-400 [&_a]:underline [&_li]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </main>
      <FooterCta />
    </>
  );
}
