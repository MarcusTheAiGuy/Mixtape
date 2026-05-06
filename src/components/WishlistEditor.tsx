"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TasteTypeahead } from "@/components/TasteTypeahead";
import type { SearchResult } from "@/lib/music-search";
import { type WishlistShow, newWishlistId } from "@/lib/wishlist";
import { STORAGE_KEYS, loadJSON, saveJSON } from "@/lib/local-store";
import { findMeetupsForWishlistShow } from "@/lib/wishlist-meetup-link";
import { SAMPLE_MEETUPS } from "@/lib/meetups";

const blank = (): WishlistShow => ({
  id: newWishlistId(),
  artist: "",
  venue: "",
  city: "",
  date: "",
  notes: "",
});

export function WishlistEditor() {
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<WishlistShow[]>([]);
  const [draft, setDraft] = useState<WishlistShow>(blank());
  const [draftArtist, setDraftArtist] = useState<SearchResult | null>(null);

  useEffect(() => {
    // Hydrate from localStorage after mount to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadJSON<WishlistShow[]>(STORAGE_KEYS.wishlist, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(STORAGE_KEYS.wishlist, items);
  }, [items, hydrated]);

  function addItem() {
    const artistName = draftArtist?.name || draft.artist;
    if (!artistName.trim()) return;
    setItems((prev) => [
      {
        ...draft,
        artist: artistName,
        artistMbid: draftArtist?.id ?? null,
      },
      ...prev,
    ]);
    setDraft(blank());
    setDraftArtist(null);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add a show</h2>
        <div className="space-y-3">
          <TasteTypeahead
            kind="artist"
            placeholder="Who do you want to see?"
            value={draftArtist}
            onSelect={(r) => setDraftArtist(r)}
            onClear={() => setDraftArtist(null)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={draft.venue ?? ""}
              onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
              placeholder="Venue (optional)"
              className="px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-indigo-400/60 placeholder:text-[color:var(--color-muted)]"
            />
            <input
              type="text"
              value={draft.city ?? ""}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              placeholder="City (optional)"
              className="px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-indigo-400/60 placeholder:text-[color:var(--color-muted)]"
            />
            <input
              type="date"
              value={draft.date ?? ""}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-indigo-400/60"
            />
            <input
              type="text"
              value={draft.notes ?? ""}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder="Notes (e.g. ticket link, vibe)"
              className="px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-indigo-400/60 placeholder:text-[color:var(--color-muted)]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addItem}
              disabled={!draftArtist && !draft.artist.trim()}
              className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add to wishlist
            </button>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <p className="text-[color:var(--color-muted)] text-center py-12">
          Nothing here yet. Add the next gig you&apos;re hoping to make it to.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => {
            const matches = findMeetupsForWishlistShow(it, SAMPLE_MEETUPS);
            return (
              <li
                key={it.id}
                className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg">{it.artist}</p>
                    <p className="text-sm text-[color:var(--color-muted)] mt-1">
                      {[it.venue, it.city].filter(Boolean).join(" · ") || "Venue TBD"}
                      {it.date ? ` · ${formatDate(it.date)}` : ""}
                    </p>
                    {it.notes && <p className="text-sm mt-2">{it.notes}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    aria-label="Remove from wishlist"
                    className="text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                {matches.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[color:var(--color-border)]">
                    <p className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-2">
                      Matching meetup{matches.length === 1 ? "" : "s"}
                    </p>
                    <ul className="space-y-1.5">
                      {matches.map((m) => (
                        <li key={m.id}>
                          <Link
                            href={`/meetups/${m.id}`}
                            className="text-sm underline underline-offset-2 hover:text-[color:var(--color-foreground)]"
                          >
                            {m.title}
                          </Link>{" "}
                          <span className="text-xs text-[color:var(--color-muted)]">
                            · {m.venue}, {m.city} · {m.when}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
