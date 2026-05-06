"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ORDERED_CATEGORIES,
  CATEGORY_META,
  currentMonthKey,
  type TasteCategory,
} from "@/lib/taste";
import {
  MOOD_STORAGE_KEY,
  formatMonth,
  isCurrentMonth,
  sortByMonthDesc,
  type MoodSnapshot,
} from "@/lib/mood";
import { loadJSON } from "@/lib/local-store";

export function MoodTimeline() {
  const [hydrated, setHydrated] = useState(false);
  const [archive, setArchive] = useState<MoodSnapshot[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setArchive(loadJSON<MoodSnapshot[]>(MOOD_STORAGE_KEY, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!hydrated) {
    return <div className="h-32 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />;
  }

  if (archive.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-10 text-center">
        <p className="text-lg mb-2">No mood entries yet.</p>
        <p className="text-[color:var(--color-muted)] mb-6 max-w-md mx-auto">
          Snapshot what you&apos;re into each month. Over time it becomes a
          little music diary you can scroll through.
        </p>
        <Link
          href="/me"
          className="inline-flex px-4 py-2 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Set this month&apos;s mood
        </Link>
      </div>
    );
  }

  const sorted = sortByMonthDesc(archive);

  return (
    <ol className="relative space-y-12 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-[color:var(--color-border)]">
      {sorted.map((snapshot) => (
        <li key={snapshot.monthKey} className="relative pl-12">
          <span className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] ring-4 ring-[color:var(--color-background)]" />
          <header className="mb-4 flex flex-wrap items-baseline gap-3">
            <h3 className="text-xl font-semibold">{formatMonth(snapshot.monthKey)}</h3>
            {isCurrentMonth(snapshot.monthKey) && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[color:var(--color-accent)]/15">
                this month
              </span>
            )}
            <span className="text-xs text-[color:var(--color-muted)]">
              {snapshot.entries.length} pick{snapshot.entries.length === 1 ? "" : "s"}
            </span>
          </header>

          {snapshot.note && (
            <p className="italic text-[color:var(--color-muted)] mb-4 max-w-prose">
              &ldquo;{snapshot.note}&rdquo;
            </p>
          )}

          {snapshot.entries.length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted)]">
              An empty month. Sometimes that&apos;s the truth.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {ORDERED_CATEGORIES.map((cat) => {
                const items = snapshot.entries
                  .filter((e) => e.category === cat)
                  .sort((a, b) => a.position - b.position);
                if (items.length === 0) return null;
                return (
                  <div
                    key={cat}
                    className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-4"
                  >
                    <p className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-2">
                      {CATEGORY_META[cat as TasteCategory].label.replace("Top 5 ", "")}
                    </p>
                    <ol className="space-y-1.5">
                      {items.map((e) => (
                        <li key={e.position} className="flex items-baseline gap-2 text-sm">
                          <span className="text-[color:var(--color-muted)] tabular-nums w-4">
                            {e.position}
                          </span>
                          <span className="font-medium truncate">{e.name}</span>
                          {e.subtitle && (
                            <span className="text-[color:var(--color-muted)] truncate">
                              · {e.subtitle}
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

// Re-exported for the diary page header — keeps the current-month label live.
export const CURRENT_MONTH_LABEL = formatMonth(currentMonthKey());
