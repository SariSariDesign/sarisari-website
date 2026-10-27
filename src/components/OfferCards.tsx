import { isExternal } from "@/lib/links";
import { Button } from "./Button";

export type Offer = { name: string; price: string; body: string; cta: { label: string; href: string } };

/** Lighter offer cards (Audit, Diagnostic, …) that sit under a retainer. */
export function OfferCards({ offers }: { offers: Offer[] }) {
  return (
    <ul className={`grid gap-4 ${offers.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {offers.map((o) => (
        <li key={o.name} className="flex flex-col gap-4 rounded-lg border border-neutral-300 bg-white p-8">
          <span className="ds-label text-label-s text-neutral-700">{o.name}</span>
          <span className="font-brand text-h1 italic leading-none text-neutral-1000">{o.price}</span>
          <p className="flex-1 text-body-s text-neutral-700">{o.body}</p>
          <div>
            <Button href={o.cta.href} variant="ghost" external={isExternal(o.cta.href)}>
              {o.cta.label}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
