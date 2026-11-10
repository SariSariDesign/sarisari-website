import Link from "next/link";

type Tile = {
  client: string;
  slug: string;
  src: string;
  /** Height / width, so columns stack like a masonry wall. */
  ratio: number;
  video?: string;
};

// Client imagery from /public/work. Each column scrolls; the middle one runs the other way.
const columns: Tile[][] = [
  [
    { client: "Kenchan", slug: "kenchan-ramen", src: "/work/kenchan-ramen.webp", ratio: 0.75 },
    { client: "Disco", slug: "disco", src: "/work/disco-cards.webp", ratio: 1.25 },
    { client: "Funding Solutions", slug: "funding-solutions", src: "/work/fs-app-history.webp", ratio: 0.72 },
    { client: "NutriSnap", slug: "nutrisnap", src: "/work/nutrisnap.webp", ratio: 1.17 },
  ],
  [
    { client: "Lendzi", slug: "lendzi", src: "/work/lendzi-cover.webp", ratio: 1.11, video: "/work/lendzi-cover.mp4" },
    { client: "Kenchan", slug: "kenchan-ramen", src: "/work/kenchan-add-to-bundle-mobile.webp", ratio: 0.67 },
    { client: "Funding Solutions", slug: "funding-solutions", src: "/work/fs-offers.webp", ratio: 1.22 },
    { client: "Disco", slug: "disco", src: "/work/disco-print.webp", ratio: 0.75 },
  ],
  [
    { client: "Disco", slug: "disco", src: "/work/disco-voice-poster.webp", ratio: 1.25, video: "/work/disco-voice.mp4" },
    { client: "Lendzi", slug: "lendzi", src: "/work/lendzi-dashboard.webp", ratio: 0.75 },
    { client: "Funding Solutions", slug: "funding-solutions", src: "/work/funding-solutions.webp", ratio: 0.75 },
    { client: "Lendzi", slug: "lendzi", src: "/work/lendzi-print.webp", ratio: 1 },
  ],
];

function TileCard({ t, hidden }: { t: Tile; hidden?: boolean }) {
  return (
    <Link
      href={`/work/${t.slug}`}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      className="group relative block overflow-hidden rounded bg-neutral-300"
      style={{ aspectRatio: `1 / ${t.ratio}` }}
    >
      {t.video ? (
        <video
          src={t.video}
          poster={t.src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.src} alt={hidden ? "" : `${t.client} project`} loading="lazy" className="h-full w-full object-cover" />
      )}
      <span className="ds-label absolute left-3 top-3 rounded bg-neutral-100/90 px-2 py-1 text-label text-neutral-1000">
        {t.client}
      </span>
      <span className="pointer-events-none absolute inset-0 rounded border border-transparent transition-colors duration-150 ease-out group-hover:border-neutral-1000" />
    </Link>
  );
}

/** Superside-style wall: three columns of client work drifting vertically. */
export function WorkWall({ className = "" }: { className?: string }) {
  return (
    <div className={`work-wall relative grid grid-cols-2 gap-4 overflow-hidden md:grid-cols-3 ${className}`}>
      {columns.map((col, i) => (
        <div key={i} className={`flex flex-col ${i === 2 ? "hidden md:flex" : ""}`}>
          <div className={`work-wall-track flex flex-col gap-4 ${i === 1 ? "work-wall-down" : ""}`}>
            {col.map((t) => (
              <TileCard key={t.src} t={t} />
            ))}
            {/* Duplicate set for a seamless loop. */}
            {col.map((t) => (
              <TileCard key={`${t.src}-dup`} t={t} hidden />
            ))}
          </div>
        </div>
      ))}
      {/* Soft fade top and bottom so the loop never shows an edge. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-neutral-100 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-100 to-transparent" />
    </div>
  );
}
