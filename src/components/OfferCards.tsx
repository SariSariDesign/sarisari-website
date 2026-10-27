import { isExternal } from "@/lib/links";
import { Button } from "./Button";

export type Offer = { id?: string; name: string; price: string; body: string; cta: { label: string; href: string } };

/** Lighter offer cards (Audit, Diagnostic, …) that sit under a retainer. */
export function OfferCards({ offers }: { offers: Offer[] }) {
  return (
    <ul className={"grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12"}>
      {offers.map((o) => (
        <li key={o.name} id={o.id} className={`col-span-4 flex flex-col gap-4 rounded border border-neutral-300 bg-white p-8 transition-colors duration-150 ease-out hover:border-neutral-1000 hover:bg-neutral-100 ${offers.length >= 3 ? "lg:col-span-4" : ""}`}>
          <span className="ds-label text-label text-neutral-700">{o.name}</span>
          <span className="font-brand text-display-s italic text-neutral-1000">{o.price}</span>
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
