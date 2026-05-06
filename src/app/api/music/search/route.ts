import { NextResponse } from "next/server";
import type { SearchKind, SearchResult } from "@/lib/music-search";

export const runtime = "nodejs";

// MusicBrainz requires a User-Agent identifying your app.
// See: https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting
const USER_AGENT =
  process.env.MUSICBRAINZ_USER_AGENT ??
  "Mixtape/0.1 ( https://github.com/MarcusTheAiGuy/Mixtape )";

const MB_BASE = "https://musicbrainz.org/ws/2";
const COVER_ART = "https://coverartarchive.org";

type MBArtistCredit = { name: string };
type MBReleaseGroup = { id: string; title: string; "artist-credit"?: MBArtistCredit[] };
type MBArtist = {
  id: string;
  name: string;
  country?: string;
  type?: string;
  disambiguation?: string;
};
type MBRecording = {
  id: string;
  title: string;
  "artist-credit"?: MBArtistCredit[];
  releases?: { "release-group"?: { id: string } }[];
};

function joinArtists(credits?: MBArtistCredit[]): string | null {
  if (!credits?.length) return null;
  return credits.map((c) => c.name).join(", ");
}

function albumArt(releaseGroupId: string): string {
  return `${COVER_ART}/release-group/${releaseGroupId}/front-250`;
}

async function mbFetch(path: string): Promise<unknown> {
  const res = await fetch(`${MB_BASE}/${path}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    // Cache typeahead responses for an hour — MB asks us to be polite.
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) throw new Error(`MusicBrainz responded ${res.status}`);
  return res.json();
}

async function searchAlbums(q: string): Promise<SearchResult[]> {
  const data = (await mbFetch(
    `release-group?query=${encodeURIComponent(q)}&fmt=json&limit=8`,
  )) as { "release-groups"?: MBReleaseGroup[] };

  return (data["release-groups"] ?? []).map((rg) => ({
    id: rg.id,
    name: rg.title,
    subtitle: joinArtists(rg["artist-credit"]),
    imageUrl: albumArt(rg.id),
    kind: "album" as const,
  }));
}

async function searchArtists(q: string): Promise<SearchResult[]> {
  const data = (await mbFetch(
    `artist?query=${encodeURIComponent(q)}&fmt=json&limit=8`,
  )) as { artists?: MBArtist[] };

  return (data.artists ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    subtitle: a.disambiguation || [a.type, a.country].filter(Boolean).join(" · ") || null,
    imageUrl: null,
    kind: "artist" as const,
  }));
}

async function searchSongs(q: string): Promise<SearchResult[]> {
  const data = (await mbFetch(
    `recording?query=${encodeURIComponent(q)}&fmt=json&limit=8`,
  )) as { recordings?: MBRecording[] };

  return (data.recordings ?? []).map((r) => {
    const rgId = r.releases?.[0]?.["release-group"]?.id;
    return {
      id: r.id,
      name: r.title,
      subtitle: joinArtists(r["artist-credit"]),
      imageUrl: rgId ? albumArt(rgId) : null,
      kind: "song" as const,
    };
  });
}

// Validate `kind` against a known set so we never forward arbitrary strings
// to MusicBrainz as the entity name.
const VALID_KINDS = new Set<SearchKind>(["album", "artist", "song"]);

const MAX_QUERY_LEN = 80;
// Strip ASCII control characters; rest of MB syntax we let through (it's
// permissive about quotes and Unicode).
const STRIPPED_RE = /[\x00-\x1F\x7F]/g;

function sanitizeQuery(raw: string): string {
  return raw.trim().replace(STRIPPED_RE, "").slice(0, MAX_QUERY_LEN);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = sanitizeQuery(searchParams.get("q") ?? "");
  const kindParam = (searchParams.get("kind") ?? "album") as SearchKind;
  const kind: SearchKind = VALID_KINDS.has(kindParam) ? kindParam : "album";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }

  try {
    const results =
      kind === "artist"
        ? await searchArtists(q)
        : kind === "song"
          ? await searchSongs(q)
          : await searchAlbums(q);
    return NextResponse.json({ results });
  } catch {
    // Don't blow up the UI on rate-limit / network blips.
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }
}
