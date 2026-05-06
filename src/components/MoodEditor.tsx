"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ORDERED_CATEGORIES,
  CATEGORY_META,
  currentMonthKey,
  type TasteCategory,
  type TasteEntry,
} from "@/lib/taste";
import { TopFiveCategory } from "@/components/TopFiveCategory";
import {
  MOOD_STORAGE_KEY,
  formatMonth,
  type MoodSnapshot,
} from "@/lib/mood";
import { loadJSON, saveJSON } from "@/lib/local-store";

const SLOT_COUNT = 5;
const emptySlots = (): (TasteEntry | null)[] =>
  Array.from({ length: SLOT_COUNT }, () => null);

type Props = {
  monthKey?: string;
  onSaved?: () => void;
};

// Compact editor for a single month's mood. Defaults to the current month.
// Reuses TopFiveCategory but lets users skip categories they don't feel
// like filling — mood is meant to be lighter than the identity layer.
export function MoodEditor({ monthKey = currentMonthKey(), onSaved }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [archive, setArchive] = useState<MoodSnapshot[]>([]);
  const [entries, setEntries] = useState<TasteEntry[]>([]);
  const [note, setNote] = useState("");
  const [activeCategory, setActiveCategory] = useState<TasteCategory>("ALBUM");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = loadJSON<MoodSnapshot[]>(MOOD_STORAGE_KEY, []);
    setArchive(stored);
    const existing = stored.find((s) => s.monthKey === monthKey);
    setEntries(existing?.entries ?? []);
    setNote(existing?.note ?? "");
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [monthKey]);

  const slots = useMemo(() => {
    const next = emptySlots();
    for (const e of entries) {
      if (e.category === activeCategory && e.position >= 1 && e.position <= SLOT_COUNT) {
        next[e.position - 1] = e;
      }
    }
    return next;
  }, [entries, activeCategory]);

  function setSlots(next: (TasteEntry | null)[]) {
    setEntries((prev) => {
      const others = prev.filter((e) => e.category !== activeCategory);
      const filled = next
        .map((entry, i) => (entry ? { ...entry, position: i + 1 } : null))
        .filter((e): e is TasteEntry => e !== null);
      return [...others, ...filled];
    });
  }

  function save() {
    const snapshot: MoodSnapshot = {
      monthKey,
      entries,
      note: note.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    const filtered = archive.filter((s) => s.monthKey !== monthKey);
    const next = [...filtered, snapshot];
    setArchive(next);
    saveJSON(MOOD_STORAGE_KEY, next);
    onSaved?.();
  }

  if (!hydrated) return null;

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1">
          Mood for
        </p>
        <h3 className="text-2xl font-semibold">{formatMonth(monthKey)}</h3>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {ORDERED_CATEGORIES.map((cat) => {
          const filled = entries.filter((e) => e.category === cat).length;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                active
                  ? "bg-[color:var(--color-foreground)] text-[color:var(--color-background)]"
                  : "border border-[color:var(--color-border)] hover:bg-white/5"
              }`}
            >
              {CATEGORY_META[cat].label.replace("Top 5 ", "")}
              {filled > 0 && (
                <span className={`ml-1.5 text-xs ${active ? "" : "text-[color:var(--color-muted)]"}`}>
                  {filled}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <TopFiveCategory
        category={activeCategory}
        entries={slots}
        onChange={setSlots}
      />

      <label className="block mt-6">
        <span className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1.5 block">
          A line about this month (optional)
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 160))}
          placeholder="What was the soundtrack for?"
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:outline-none focus:border-[color:var(--color-accent)] resize-none"
        />
        <p className="text-xs text-[color:var(--color-muted)] mt-1">
          {160 - note.length} characters left
        </p>
      </label>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={save}
          className="px-4 py-2 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Save mood
        </button>
      </div>
    </div>
  );
}
