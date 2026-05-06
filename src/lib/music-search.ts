// Shared types + a thin client for the /api/music/search endpoint.

export type SearchKind = "album" | "artist" | "song";

export type SearchResult = {
  id: string;
  name: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  kind: SearchKind;
};

export async function searchMusic(
  query: string,
  kind: SearchKind,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `/api/music/search?q=${encodeURIComponent(query)}&kind=${kind}`,
    { signal },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { results: SearchResult[] };
  return data.results ?? [];
}
