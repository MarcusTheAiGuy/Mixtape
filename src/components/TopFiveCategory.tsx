"use client";

import type { SearchResult } from "@/lib/music-search";
import {
  type TasteCategory,
  type TasteEntry,
  CATEGORY_META,
  fromSearchResult,
  toSearchResult,
} from "@/lib/taste";
import { TasteTypeahead } from "@/components/TasteTypeahead";
import { GENRES } from "@/lib/genres";

type Props = {
  category: TasteCategory;
  entries: (TasteEntry | null)[]; // length 5
  onChange: (next: (TasteEntry | null)[]) => void;
};

export function TopFiveCategory({ category, entries, onChange }: Props) {
  const meta = CATEGORY_META[category];

  function setSlot(index: number, entry: TasteEntry | null) {
    const next = [...entries];
    next[index] = entry;
    onChange(next);
  }

  return (
    <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">{meta.label}</h2>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">{meta.helper}</p>
      </header>

      <ol className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full border border-[color:var(--color-border)] flex items-center justify-center text-xs text-[color:var(--color-muted)] mt-3">
              {i + 1}
            </span>
            <div className="flex-1">
              <SlotInput
                category={category}
                position={i + 1}
                value={entries[i]}
                onSelect={(entry) => setSlot(i, entry)}
                onClear={() => setSlot(i, null)}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

type SlotProps = {
  category: TasteCategory;
  position: number;
  value: TasteEntry | null;
  onSelect: (entry: TasteEntry) => void;
  onClear: () => void;
};

function SlotInput({ category, position, value, onSelect, onClear }: SlotProps) {
  if (category === "GENRE") {
    return (
      <GenreSelect
        value={value}
        onSelect={(genre) =>
          onSelect({ category, position, name: genre, subtitle: null, imageUrl: null })
        }
        onClear={onClear}
      />
    );
  }

  if (category === "LIVE_SHOW") {
    return (
      <LiveShowInput
        value={value}
        onChange={(entry) => (entry ? onSelect({ ...entry, position }) : onClear())}
      />
    );
  }

  const kind = category === "ALBUM" ? "album" : category === "ARTIST" ? "artist" : "song";
  return (
    <TasteTypeahead
      kind={kind}
      placeholder={`Add a ${kind}…`}
      value={value ? toSearchResult(value) : null}
      onSelect={(r: SearchResult) => onSelect(fromSearchResult(category, position, r))}
      onClear={onClear}
    />
  );
}

function GenreSelect({
  value,
  onSelect,
  onClear,
}: {
  value: TasteEntry | null;
  onSelect: (genre: string) => void;
  onClear: () => void;
}) {
  if (value) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60">
        <span className="shrink-0 w-10 h-10 rounded-md bg-gradient-to-br from-pink-400/40 to-indigo-400/40" />
        <p className="flex-1 font-medium">{value.name}</p>
        <button
          type="button"
          aria-label="Remove selection"
          onClick={onClear}
          className="text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] text-xl leading-none px-1"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <select
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) onSelect(e.target.value);
      }}
      className="w-full px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60"
    >
      <option value="" disabled>
        Pick a genre…
      </option>
      {GENRES.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  );
}

function LiveShowInput({
  value,
  onChange,
}: {
  value: TasteEntry | null;
  onChange: (entry: TasteEntry | null) => void;
}) {
  // Live show is freeform: artist (name) + venue/year (subtitle).
  const currentArtist = value?.name ?? "";
  const currentSub = value?.subtitle ?? "";

  function update(next: { artist?: string; subtitle?: string }) {
    const artistNext = next.artist ?? currentArtist;
    const subNext = next.subtitle ?? currentSub;
    if (!artistNext.trim() && !subNext.trim()) {
      onChange(null);
      return;
    }
    onChange({
      category: "LIVE_SHOW",
      position: value?.position ?? 1,
      name: artistNext,
      subtitle: subNext || null,
      imageUrl: value?.imageUrl ?? null,
      externalId: value?.externalId ?? null,
    });
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <input
        type="text"
        value={currentArtist}
        onChange={(e) => update({ artist: e.target.value })}
        placeholder="Artist"
        className="px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60 placeholder:text-[color:var(--color-muted)]"
      />
      <input
        type="text"
        value={currentSub}
        onChange={(e) => update({ subtitle: e.target.value })}
        placeholder="Venue, city · year"
        className="px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60 placeholder:text-[color:var(--color-muted)]"
      />
      <p className="sm:col-span-2 text-xs text-[color:var(--color-muted)]">
        Tip: just enough to remember it by — e.g. <em>Brixton Academy, 2023</em>.
      </p>
    </div>
  );
}
