import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Eyebrow + serif headline (+ optional intro), the shared section-header device. 8 columns wide. */
export function SectionHeader({
  eyebrow,
  headline,
  intro,
  headingId,
}: {
  eyebrow?: string;
  headline: string;
  intro?: string;
  headingId?: string;
}) {
  return (
    <Reveal delay={100} className="cols-8 flex flex-col gap-4">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={headingId}
        className="text-balance font-brand text-display-m text-neutral-1000"
      >
        {headline}
      </h2>
      {intro && <p className="text-body text-neutral-700">{intro}</p>}
    </Reveal>
  );
}
