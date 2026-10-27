import { Button } from "./Button";

export type Retainer = {
  /** Anchor the use-case buttons scroll to and highlight. */
  id?: string;
  /** Tier name shown above the price (e.g. "Grow"); omitted on the homepage. */
  name?: string;
  price: string;
  period: string;
  description: string;
  cta: { label: string; href: string };
  features: { title: string; body?: string }[];
};

/** A retainer offer: price, pitch, and its numbered feature list. */
export function RetainerPanel({ retainer: r }: { retainer: Retainer }) {
  return (
    <div id={r.id} className="grid gap-12 border border-neutral-300 bg-white p-8 transition-colors duration-150 ease-out hover:border-neutral-1000 md:grid-cols-2 md:p-12">
      <div className="flex flex-col gap-6">
        {r.name && <span className="ds-label text-label text-neutral-700">{r.name}</span>}
        <div className="flex items-baseline gap-2">
          <span className="font-brand text-display-s italic text-neutral-1000">
            {r.price}
          </span>
          <span className="text-lead text-neutral-700">{r.period}</span>
        </div>
        <p className="text-body text-neutral-700">{r.description}</p>
        <div>
          <Button href={r.cta.href} external>
            {r.cta.label}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {r.features.map((f, i) => (
          <FeatureRow key={f.title} n={String(i + 1).padStart(2, "0")} title={f.title} body={f.body} />
        ))}
      </div>
    </div>
  );
}

function FeatureRow({ n, title, body }: { n: string; title: string; body?: string }) {
  return (
    <div className="flex gap-4 border-b border-neutral-400 pb-6 last:border-b-0 last:pb-0">
      <span className="ds-label flex h-8 w-8 shrink-0 items-center justify-center border border-neutral-400 text-label text-neutral-700">
        {n}
      </span>
      <div className="flex flex-col gap-1">
        <h4 className="text-heading-m text-neutral-1000">{title}</h4>
        {body && <p className="text-body-s text-neutral-700">{body}</p>}
      </div>
    </div>
  );
}
