import type { TasteEntry } from "@/lib/taste";

export type MeetupFit = {
  pct: number; // 0..100
  matched: string[]; // tasteFilters that hit
};

/**
 * How well a meetup's `tasteFilters` line up with the viewer's top 5s.
 *
 * - Filters are matched case-insensitively as **substrings** against each
 *   entry's `name` and `subtitle` (the credited artist for albums/songs).
 * - Each entry has a weight from its category + position. Genre and artist
 *   hits count more than album/song/live-show hits.
 * - Result is the raw fraction `scored / possible` capped to 100% — so a
 *   single perfect-fit hit on a one-filter meetup honestly reads as 100%,
 *   while two-of-three filter hits at lower positions reads as ~40-60%.
 *
 * Pure. See `__tests__/meetup-fit.test.ts` for behaviour pinned by tests.
 */
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
  // Raw fraction of "ideal" score (every filter hit at top weight in the
  // top-weighted lane). Honest signal: a single perfect hit scores 100,
  // a single mediocre hit scores low, two-of-three filter hits roughly tracks.
  const raw = scored / possible;
  const pct = Math.round(Math.min(1, raw) * 100);
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
