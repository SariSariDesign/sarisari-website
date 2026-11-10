import { isExternal } from "@/lib/links";

export type OfferCard = {
  id: string;
  name: string;
  summary: string;
  price: string;
  period?: string;
  cta: { label: string; href: string };
  features: string[];
  featured?: boolean;
  note?: string;
};

/** Simple offer cards: name, one line, price, one button, then a plus-list. */
export function OfferGrid({ offers }: { offers: OfferCard[] }) {
  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12">
      {offers.map((o) => {
        const ext = isExternal(o.cta.href);
        return (
          <div
            key={o.id}
            id={o.id}
            className={`col-span-4 flex flex-col gap-6 rounded p-6 lg:col-span-3 lg:p-4 ${o.featured ? "bg-primary-400 text-neutral-100" : "bg-neutral-200 text-neutral-1000"}`}
          >
            <div className="flex flex-col gap-2">
              <h3 className="whitespace-nowrap text-heading-m lg:text-lead">{o.name}</h3>
              <p className={`text-body ${o.featured ? "text-primary-100" : "text-neutral-700"}`}>{o.summary}</p>
            </div>
            <p className="flex flex-wrap items-baseline gap-x-1 whitespace-nowrap">
              <span className="font-brand text-heading-l">{o.price}</span>
              {o.period && <span className={`text-body ${o.featured ? "text-primary-100" : "text-neutral-700"}`}>{o.period}</span>}
            </p>
            <div className={`h-px ${o.featured ? "bg-primary-300" : "bg-neutral-300"}`} />
            <a
              href={o.cta.href}
              {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`ds-label flex h-12 items-center justify-center rounded text-label transition-colors duration-150 ease-out ${o.featured ? "bg-neutral-100 text-primary-500 hover:bg-neutral-200" : "bg-primary-400 text-neutral-100 hover:bg-primary-500"}`}
            >
              {o.cta.label}
            </a>
            <ul className="flex flex-col gap-3">
              {o.features.map((f) => (
                <li key={f} className="flex gap-2 text-body">
                  <span aria-hidden className={o.featured ? "text-primary-200" : "text-neutral-600"}>+</span>
                  {f}
                </li>
              ))}
            </ul>
            {o.note && <p className={`mt-auto text-body-s ${o.featured ? "text-primary-100" : "text-neutral-700"}`}>{o.note}</p>}
          </div>
        );
      })}
    </div>
  );
}
