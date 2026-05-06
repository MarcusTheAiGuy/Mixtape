import type { TasteEntry, TasteCategory } from "@/lib/taste";

export type Insights = {
  totalFilled: number;
  totalSlots: number;
  completion: number; // 0..1
  perCategory: Record<TasteCategory, number>;
  vibe: string | null;
  crossovers: Array<{
    name: string;
    appearances: { category: TasteCategory; position: number }[];
  }>;
  topGenres: Array<{ name: string; weight: number }>;
};

const TOTAL_SLOTS = 25;

const CATEGORY_KEYS: TasteCategory[] = ["ALBUM", "ARTIST", "GENRE", "SONG", "LIVE_SHOW"];

// Loose mapping from common genres to vibe-words. Keep tiny + easy to expand.
const GENRE_VIBES: Record<string, string[]> = {
  "Shoegaze": ["hazy", "wall-of-sound"],
  "Dream pop": ["hazy", "soft-lit"],
  "Indie folk": ["plainspoken", "earthy"],
  "Folk": ["plainspoken", "earthy"],
  "Indie rock": ["scrappy", "guitar-forward"],
  "Indie pop": ["bright", "hook-led"],
  "Pop": ["bright", "hook-led"],
  "Post-punk": ["wired", "angular"],
  "Punk": ["loud", "wired"],
  "Post-rock": ["cinematic", "patient"],
  "Cinematic": ["cinematic", "widescreen"],
  "Ambient": ["patient", "weather-like"],
  "Electronic": ["pulsed", "after-hours"],
  "House": ["after-hours", "bodied"],
  "Techno": ["after-hours", "industrial"],
  "Disco": ["bodied", "shimmery"],
  "Funk": ["bodied", "swung"],
  "Soul": ["soulful", "warm"],
  "Neo-soul": ["soulful", "smoky"],
  "Jazz": ["smoky", "loose"],
  "Hip-hop": ["lyrical", "rooted"],
  "Trap": ["bass-heavy", "nocturnal"],
  "R&B": ["soulful", "smoky"],
  "Country": ["dusty", "honest"],
  "Americana": ["dusty", "honest"],
  "Bluegrass": ["dusty", "picked"],
  "Metal": ["heavy", "thunderous"],
  "Hardcore": ["heavy", "fast"],
  "Math rock": ["mathy", "skipping"],
  "Experimental": ["weird", "unmoored"],
  "Noise": ["weird", "abrasive"],
  "Synth-pop": ["neon", "after-hours"],
  "New wave": ["neon", "stylish"],
  "Alternative": ["scrappy", "left-of-centre"],
  "Grunge": ["sludgy", "anthemic"],
  "Britpop": ["jangly", "anthemic"],
  "Garage": ["scrappy", "lo-fi"],
  "Lo-fi": ["lo-fi", "soft-lit"],
  "Singer-songwriter": ["plainspoken", "diaristic"],
  "Reggae": ["sun-warmed", "loose"],
  "Latin": ["rhythmic", "celebratory"],
  "Reggaeton": ["bodied", "celebratory"],
  "Trance": ["after-hours", "soaring"],
  "Drum & bass": ["after-hours", "fast"],
  "Jungle": ["after-hours", "fast"],
  "Trip-hop": ["smoky", "after-hours"],
  "Dub": ["bass-heavy", "loose"],
  "Soundtrack": ["cinematic", "scored"],
  "Classical": ["scored", "patient"],
  "World": ["worldly", "rhythmic"],
  "Bossa nova": ["sun-warmed", "loose"],
  "Emo": ["plaintive", "anthemic"],
  "Industrial": ["industrial", "wired"],
  "Psychedelic": ["lysergic", "soft-lit"],
  "Progressive rock": ["sprawling", "cinematic"],
  "Alt-country": ["dusty", "plainspoken"],
  "K-pop": ["bright", "neon"],
  "Ska": ["jaunty", "swung"],
};

function vibeWordsFor(genre: string): string[] {
  if (GENRE_VIBES[genre]) return GENRE_VIBES[genre];
  const lower = genre.toLowerCase();
  const k = Object.keys(GENRE_VIBES).find((key) =>
    key.toLowerCase().startsWith(lower.slice(0, 4)),
  );
  return k ? GENRE_VIBES[k] : [];
}

/**
 * Derive everything the `<TasteInsights>` panel shows from a flat list of
 * taste entries. Pure function — completely deterministic, no IO.
 *
 * Returned fields:
 * - `totalFilled` / `totalSlots` / `completion` — how full the profile is
 * - `perCategory` — count of entries per category (for the per-row dots)
 * - `topGenres` — genres ranked by position weight (5..1)
 * - `vibe` — a short phrase pulled from the GENRE_VIBES keyword map; falls
 *   back to listing the genres if no keywords match
 * - `crossovers` — names that appear across multiple categories (e.g. an
 *   artist in Top Artists who also has an album in Top Albums)
 *
 * Tweak the `GENRE_VIBES` map to add more vocab or change tone.
 */
export function computeInsights(entries: TasteEntry[]): Insights {
  const perCategory = Object.fromEntries(CATEGORY_KEYS.map((c) => [c, 0])) as Record<
    TasteCategory,
    number
  >;
  for (const e of entries) perCategory[e.category]++;

  const totalFilled = entries.length;
  const completion = Math.min(1, totalFilled / TOTAL_SLOTS);

  // Top genres weighted by position (position 1 = weight 5)
  const topGenres = entries
    .filter((e) => e.category === "GENRE")
    .map((e) => ({ name: e.name, weight: 6 - e.position }))
    .sort((a, b) => b.weight - a.weight);

  // Cross-category appearances — match on name (artists) and subtitle ("By: ...")
  const buckets = new Map<string, { category: TasteCategory; position: number }[]>();
  function bump(name: string, hit: { category: TasteCategory; position: number }) {
    const key = name.trim().toLowerCase();
    if (!key) return;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(hit);
  }
  for (const e of entries) {
    if (e.category === "ARTIST" || e.category === "LIVE_SHOW") {
      bump(e.name, { category: e.category, position: e.position });
    }
    if ((e.category === "ALBUM" || e.category === "SONG") && e.subtitle) {
      bump(e.subtitle, { category: e.category, position: e.position });
    }
  }
  const crossovers = [...buckets.entries()]
    .filter(([, hits]) => new Set(hits.map((h) => h.category)).size >= 2)
    .map(([name, hits]) => ({
      name: titleCase(name),
      appearances: hits.sort((a, b) => a.category.localeCompare(b.category)),
    }))
    .sort((a, b) => b.appearances.length - a.appearances.length)
    .slice(0, 4);

  // Vibe descriptor: pull words from top 3 genres, dedupe, take first 3.
  const words: string[] = [];
  for (const g of topGenres.slice(0, 3)) {
    for (const w of vibeWordsFor(g.name)) {
      if (!words.includes(w)) words.push(w);
    }
  }
  let vibe: string | null = null;
  if (words.length >= 2) {
    const w = words.slice(0, 3);
    vibe = w.length === 3 ? `${w[0]}, ${w[1]}, ${w[2]}` : `${w[0]} and ${w[1]}`;
  } else if (topGenres.length > 0) {
    vibe = topGenres
      .slice(0, 3)
      .map((g) => g.name.toLowerCase())
      .join(" / ");
  }

  return {
    totalFilled,
    totalSlots: TOTAL_SLOTS,
    completion,
    perCategory,
    vibe,
    crossovers,
    topGenres: topGenres.slice(0, 5),
  };
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}
