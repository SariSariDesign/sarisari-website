type Service = { title: string; body: string };

type Pack = "bag" | "sachet" | "jar" | "candy";

/** Shelf order of package shapes, and the wrapper color each one is printed in. */
const STOCK: { pack: Pack; skin: string; tilt: number }[] = [
  { pack: "bag", skin: "bg-orange-200", tilt: -1.5 },
  { pack: "sachet", skin: "bg-primary-100", tilt: 1.2 },
  { pack: "jar", skin: "bg-white", tilt: 0 },
  { pack: "candy", skin: "bg-yellow-200", tilt: -1 },
  { pack: "sachet", skin: "bg-success-100", tilt: -1.2 },
  { pack: "candy", skin: "bg-orange-100", tilt: 1 },
  { pack: "bag", skin: "bg-primary-200", tilt: 1.5 },
  { pack: "jar", skin: "bg-white", tilt: 0 },
];

/**
 * Services as a sari-sari store shelf: each service is stocked as a different snack —
 * a crimped chip bag, a serrated sachet with its hang hole, a garapon candy jar, a
 * twist-wrapped candy — standing on wooden shelf planks, four to a shelf at desktop.
 * Shapes are pure CSS (clip-path / mask, see `.pack-*` in globals.css); text stays live.
 */
export function SnackShelf({ items }: { items: Service[] }) {
  return (
    <ul className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => {
        const { pack, skin, tilt } = STOCK[i % STOCK.length];
        return (
          <li
            key={s.title}
            className="shelf-slot relative flex items-end justify-center px-3 pb-[14px] pt-10"
          >
            <div
              className={`pack pack-${pack} w-full`}
              style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
            >
              {pack === "jar" && <span className="pack-lid" aria-hidden />}
              <div className={`pack-body ${skin}`}>
                <h3 className="text-title-l font-medium text-neutral-1000">{s.title}</h3>
                <p className="text-body-s text-neutral-800">{s.body}</p>
                {pack === "bag" && <span className="pack-barcode" aria-hidden />}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
