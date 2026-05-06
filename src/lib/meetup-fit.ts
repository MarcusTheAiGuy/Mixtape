import type { TasteEntry } from "@/lib/taste";

export type MeetupFit = {
  pct: number; // 0..100
  matched: string[]; // tasteFilters that hit
};

// How well a meetup's tasteFilters match the viewer's top 5s.
// Each filter looks for substring overlap (case-insensitive) against entry
// names and subtitles. Genre + artist hits count more than song/album hits.
export function computeMeetupFit(entries: TasteEntry[], filters: string[]): MeetupFit {
  if (entries.length === 0 || filters.length === 0) {
    return { pct: 0, matched: [] };
  }

  const haystack = entries.map((e) => ({
    text: `${e.name} ${e.subtitle ?? ""}`.toLowerCase(),
    weight: weightFor(e),
  }));

  let scored = 0;
  let possible = 0;
  const matched: string[] = [];

  for (const filter of filters) {
    const f = filter.trim().toLowerCase();
    if (!f) continue;
    possible += 5;
    let hit = 0;
    for (const h of haystack) {
      if (h.text.includes(f)) {
        hit = Math.max(hit, h.weight);
      }
    }
    if (hit > 0) {
      scored += hit;
      matched.push(filter);
    }
  }

  if (possible === 0) return { pct: 0, matched: [] };
  // Stretch: matching half the filters at top weight should feel like a strong fit.
  const raw = scored / possible;
  const pct = Math.round(Math.min(1, raw / 0.5) * 100);
  return { pct, matched };
}

function weightFor(e: TasteEntry): number {
  const positionWeight = Math.max(1, 6 - e.position);
  switch (e.category) {
    case "GENRE":
    case "ARTIST":
      return positionWeight;
    case "ALBUM":
    case "SONG":
    case "LIVE_SHOW":
      return positionWeight * 0.7;
    default:
      return positionWeight * 0.5;
  }
}
