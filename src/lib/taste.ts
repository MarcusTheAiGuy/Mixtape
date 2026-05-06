import type { SearchResult } from "@/lib/music-search";

export type TasteCategory = "ALBUM" | "ARTIST" | "GENRE" | "SONG" | "LIVE_SHOW";

// Mirror of Prisma's TasteEntry, minus DB-managed fields.
export type TasteEntry = {
  category: TasteCategory;
  position: number; // 1..5
  name: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  externalId?: string | null;
};

export const CATEGORY_META: Record<
  TasteCategory,
  { label: string; helper: string; order: number }
> = {
  ALBUM: {
    label: "Top 5 albums",
    helper: "The records you reach for. Anything goes — don't overthink it.",
    order: 1,
  },
  ARTIST: {
    label: "Top 5 artists",
    helper: "Who's been on rotation, lately or forever.",
    order: 2,
  },
  GENRE: {
    label: "Top 5 genres",
    helper: "What you'd call your taste if pressed.",
    order: 3,
  },
  SONG: {
    label: "Top 5 songs",
    helper: "Tracks you'd put on a tape for someone you like.",
    order: 4,
  },
  LIVE_SHOW: {
    label: "Top 5 live performances",
    helper: "Shows you've been to that you still talk about.",
    order: 5,
  },
};

export const ORDERED_CATEGORIES: TasteCategory[] = (
  Object.keys(CATEGORY_META) as TasteCategory[]
).sort((a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order);

export function fromSearchResult(
  category: TasteCategory,
  position: number,
  result: SearchResult,
): TasteEntry {
  return {
    category,
    position,
    name: result.name,
    subtitle: result.subtitle ?? null,
    imageUrl: result.imageUrl ?? null,
    externalId: result.id,
  };
}

export function toSearchResult(entry: TasteEntry): SearchResult {
  const kindMap: Record<TasteCategory, SearchResult["kind"]> = {
    ALBUM: "album",
    ARTIST: "artist",
    SONG: "song",
    GENRE: "album", // unused; genre input uses a select
    LIVE_SHOW: "artist", // live shows fall back to artist typeahead
  };
  return {
    id: entry.externalId ?? `${entry.category}-${entry.position}-${entry.name}`,
    name: entry.name,
    subtitle: entry.subtitle,
    imageUrl: entry.imageUrl,
    kind: kindMap[entry.category],
  };
}

export function currentMonthKey(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
