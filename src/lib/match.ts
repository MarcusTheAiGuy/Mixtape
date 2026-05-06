import type { TasteCategory, TasteEntry } from "@/lib/taste";

export type MatchLane = "genres" | "artists" | "albums" | "songs" | "liveShows";

export type MatchResult = {
  score: number; // 0..1, weighted Jaccard across lanes
  shared: Record<MatchLane, string[]>;
  totalShared: number;
};

const EMPTY_RESULT: MatchResult = {
  score: 0,
  shared: { genres: [], artists: [], albums: [], songs: [], liveShows: [] },
  totalShared: 0,
};

// Weight per slot (position 1 = 5, position 5 = 1).
function weightFor(position: number): number {
  return Math.max(1, 6 - position);
}

// Per-lane importance — genres + artists matter most for compatibility.
const LANE_WEIGHTS: Record<MatchLane, number> = {
  genres: 1.5,
  artists: 1.5,
  albums: 1,
  songs: 1,
  liveShows: 1,
};

type Bag = Map<string, { weight: number; display: string }>;

function bump(bag: Bag, name: string, weight: number) {
  const key = name.trim().toLowerCase();
  if (!key) return;
  const prev = bag.get(key);
  if (!prev) bag.set(key, { weight, display: name.trim() });
  else if (weight > prev.weight) bag.set(key, { weight, display: prev.display });
}

function buildLanes(entries: TasteEntry[]): Record<MatchLane, Bag> {
  const lanes: Record<MatchLane, Bag> = {
    genres: new Map(),
    artists: new Map(),
    albums: new Map(),
    songs: new Map(),
    liveShows: new Map(),
  };
  for (const e of entries) {
    const w = weightFor(e.position);
    switch (e.category as TasteCategory) {
      case "GENRE":
        bump(lanes.genres, e.name, w);
        break;
      case "ARTIST":
        bump(lanes.artists, e.name, w);
        break;
      case "ALBUM":
        bump(lanes.albums, e.name, w);
        if (e.subtitle) bump(lanes.artists, e.subtitle, w / 2);
        break;
      case "SONG":
        bump(lanes.songs, e.name, w);
        if (e.subtitle) bump(lanes.artists, e.subtitle, w / 2);
        break;
      case "LIVE_SHOW":
        bump(lanes.liveShows, e.name, w);
        bump(lanes.artists, e.name, w / 2);
        break;
    }
  }
  return lanes;
}

function laneOverlap(a: Bag, b: Bag) {
  let intersection = 0;
  let union = 0;
  const shared: string[] = [];
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const k of keys) {
    const wa = a.get(k)?.weight ?? 0;
    const wb = b.get(k)?.weight ?? 0;
    intersection += Math.min(wa, wb);
    union += Math.max(wa, wb);
    if (wa > 0 && wb > 0) {
      shared.push(a.get(k)?.display ?? b.get(k)?.display ?? k);
    }
  }
  return { intersection, union, shared };
}

export function computeMatch(a: TasteEntry[], b: TasteEntry[]): MatchResult {
  if (a.length === 0 || b.length === 0) return EMPTY_RESULT;
  const A = buildLanes(a);
  const B = buildLanes(b);

  let totalInter = 0;
  let totalUnion = 0;
  const shared: Record<MatchLane, string[]> = {
    genres: [],
    artists: [],
    albums: [],
    songs: [],
    liveShows: [],
  };

  (Object.keys(LANE_WEIGHTS) as MatchLane[]).forEach((lane) => {
    const o = laneOverlap(A[lane], B[lane]);
    totalInter += o.intersection * LANE_WEIGHTS[lane];
    totalUnion += o.union * LANE_WEIGHTS[lane];
    shared[lane] = o.shared;
  });

  const score = totalUnion > 0 ? totalInter / totalUnion : 0;
  const totalShared = Object.values(shared).reduce((s, arr) => s + arr.length, 0);
  return { score, shared, totalShared };
}

export function matchPercent(score: number): number {
  // Pure Jaccard tops out around 0.4-0.5 even for similar profiles, so we
  // stretch it for display. Anything above 0.4 is "very high".
  const stretched = Math.min(1, score / 0.4);
  return Math.round(stretched * 100);
}
