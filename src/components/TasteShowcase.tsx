import {
  ORDERED_CATEGORIES,
  CATEGORY_META,
  type TasteCategory,
  type TasteEntry,
} from "@/lib/taste";

type Props = {
  entries: TasteEntry[];
  emptyHint?: string;
};

// Server-renderable showcase. Pure function of `entries` — no client state.
export function TasteShowcase({ entries, emptyHint }: Props) {
  const grouped = groupByCategory(entries);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-12 text-center text-[color:var(--color-muted)]">
        {emptyHint ?? "Nothing here yet."}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {ORDERED_CATEGORIES.map((cat) => {
        const items = grouped.get(cat) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={cat}>
            <header className="mb-4 flex items-end justify-between">
              <h2 className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                {CATEGORY_META[cat].label}
              </h2>
              <span className="text-xs text-[color:var(--color-muted)]">
                {items.length}/5
              </span>
            </header>
            <CategoryBlock category={cat} items={items} />
          </section>
        );
      })}
    </div>
  );
}

function groupByCategory(entries: TasteEntry[]): Map<TasteCategory, TasteEntry[]> {
  const map = new Map<TasteCategory, TasteEntry[]>();
  for (const cat of ORDERED_CATEGORIES) map.set(cat, []);
  for (const e of entries) map.get(e.category)?.push(e);
  for (const list of map.values()) list.sort((a, b) => a.position - b.position);
  return map;
}

function CategoryBlock({ category, items }: { category: TasteCategory; items: TasteEntry[] }) {
  switch (category) {
    case "ALBUM":
      return <AlbumGrid items={items} />;
    case "ARTIST":
      return <ArtistGrid items={items} />;
    case "GENRE":
      return <GenreTier items={items} />;
    case "SONG":
      return <SongList items={items} />;
    case "LIVE_SHOW":
      return <LiveShowList items={items} />;
  }
}

function AlbumGrid({ items }: { items: TasteEntry[] }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {items.map((e) => (
        <li key={`${e.category}-${e.position}`} className="group">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-pink-400/30 to-indigo-400/30 mb-2">
            {e.imageUrl && <Cover src={e.imageUrl} alt={e.name} />}
            <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs font-semibold">
              {e.position}
            </span>
          </div>
          <p className="font-medium text-sm leading-snug truncate">{e.name}</p>
          {e.subtitle && (
            <p className="text-xs text-[color:var(--color-muted)] truncate">By {e.subtitle}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function ArtistGrid({ items }: { items: TasteEntry[] }) {
  return (
    <ul className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {items.map((e) => (
        <li key={`${e.category}-${e.position}`} className="text-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-fuchsia-400/40 via-pink-400/40 to-indigo-400/40 flex items-center justify-center mb-2">
            <span className="text-xl sm:text-2xl font-semibold">
              {e.name.charAt(0).toUpperCase()}
            </span>
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] flex items-center justify-center text-xs font-semibold">
              {e.position}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug truncate">{e.name}</p>
        </li>
      ))}
    </ul>
  );
}

function GenreTier({ items }: { items: TasteEntry[] }) {
  // Bigger type for higher-ranked genres, scaled by position.
  const sizes = ["text-3xl md:text-4xl", "text-2xl md:text-3xl", "text-xl md:text-2xl", "text-lg", "text-base"];
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 leading-tight">
      {items.map((e, i) => (
        <li key={`${e.category}-${e.position}`} className={`${sizes[i] ?? "text-base"} font-semibold`}>
          {e.name}
          {i < items.length - 1 && (
            <span className="ml-4 text-[color:var(--color-muted)] font-normal">·</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function SongList({ items }: { items: TasteEntry[] }) {
  return (
    <ol className="divide-y divide-[color:var(--color-border)] rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 overflow-hidden">
      {items.map((e) => (
        <li key={`${e.category}-${e.position}`} className="flex items-center gap-4 p-3">
          <span className="shrink-0 w-6 text-sm text-[color:var(--color-muted)] tabular-nums text-right">
            {e.position}
          </span>
          <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-pink-400/30 to-indigo-400/30">
            {e.imageUrl && <Cover src={e.imageUrl} alt="" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{e.name}</p>
            {e.subtitle && (
              <p className="text-sm text-[color:var(--color-muted)] truncate">By {e.subtitle}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function LiveShowList({ items }: { items: TasteEntry[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((e) => (
        <li
          key={`${e.category}-${e.position}`}
          className="relative rounded-xl border border-[color:var(--color-border)] bg-gradient-to-br from-[color:var(--color-card)]/60 to-[color:var(--color-card)]/20 p-4 pl-12"
        >
          <span className="absolute left-3 top-4 w-7 h-7 rounded-full border border-[color:var(--color-border)] flex items-center justify-center text-xs text-[color:var(--color-muted)]">
            {e.position}
          </span>
          <p className="font-semibold">{e.name}</p>
          {e.subtitle && (
            <p className="text-sm text-[color:var(--color-muted)] mt-0.5">{e.subtitle}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function Cover({ src, alt }: { src: string; alt: string }) {
  // Plain <img> because cover-art URLs redirect to archive.org subdomains
  // we can't enumerate for next/image. Server-renderable; missing covers
  // simply show the gradient placeholder underneath.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover"
    />
  );
}
