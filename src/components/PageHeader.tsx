import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Sub-page opener: eyebrow + serif h1 + intro, on the 1200px measure. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <Reveal delay={100} className="cols-8 flex flex-col gap-4">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-balance font-brand text-display-m text-neutral-1000">
        {title}
      </h1>
      {intro && <p className="text-lead text-neutral-700">{intro}</p>}
    </Reveal>
  );
}
