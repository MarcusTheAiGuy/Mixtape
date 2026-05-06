"use client";

import { useEffect, useMemo, useState } from "react";
import { ORDERED_CATEGORIES, type TasteEntry } from "@/lib/taste";
import { TopFiveCategory } from "@/components/TopFiveCategory";
import { STORAGE_KEYS, loadJSON, saveJSON } from "@/lib/local-store";

const SLOT_COUNT = 5;

function emptySlots(): (TasteEntry | null)[] {
  return Array.from({ length: SLOT_COUNT }, () => null);
}

export function TasteEditor() {
  const [hydrated, setHydrated] = useState(false);
  const [entries, setEntries] = useState<TasteEntry[]>([]);

  useEffect(() => {
    // Hydrate from localStorage after mount to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(loadJSON<TasteEntry[]>(STORAGE_KEYS.identity, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(STORAGE_KEYS.identity, entries);
  }, [entries, hydrated]);

  const slotsByCategory = useMemo(() => {
    const map = new Map<string, (TasteEntry | null)[]>();
    for (const cat of ORDERED_CATEGORIES) map.set(cat, emptySlots());
    for (const e of entries) {
      const slots = map.get(e.category);
      if (slots && e.position >= 1 && e.position <= SLOT_COUNT) {
        slots[e.position - 1] = e;
      }
    }
    return map;
  }, [entries]);

  function setCategorySlots(category: string, next: (TasteEntry | null)[]) {
    setEntries((prev) => {
      const others = prev.filter((e) => e.category !== category);
      const filled = next
        .map((entry, i) => (entry ? { ...entry, position: i + 1 } : null))
        .filter((e): e is TasteEntry => e !== null);
      return [...others, ...filled];
    });
  }

  return (
    <>
      <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 mb-8 text-sm">
        <strong className="font-semibold">Local preview.</strong> Saving stays in this browser
        for now. Once auth + database are connected, your taste profile will sync to your account.
      </div>

      <div className="space-y-6">
        {ORDERED_CATEGORIES.map((cat) => (
          <TopFiveCategory
            key={cat}
            category={cat}
            entries={slotsByCategory.get(cat) ?? emptySlots()}
            onChange={(next) => setCategorySlots(cat, next)}
          />
        ))}
      </div>
    </>
  );
}
