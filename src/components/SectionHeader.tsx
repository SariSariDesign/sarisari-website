import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Eyebrow + serif headline (+ optional intro), the shared section-header device. */
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
    <Reveal className="flex max-w-[760px] flex-col gap-5">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={headingId}
        className="text-balance font-brand text-display-s leading-[1.05] text-neutral-1000"
      >
        {headline}
      </h2>
      {intro && <p className="text-body-l text-neutral-700">{intro}</p>}
    </Reveal>
  );
}
