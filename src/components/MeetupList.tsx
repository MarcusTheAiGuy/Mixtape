"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { computeMeetupFit, type MeetupFit } from "@/lib/meetup-fit";
import { STORAGE_KEYS, loadJSON } from "@/lib/local-store";
import type { TasteEntry } from "@/lib/taste";
import type { MeetupItem } from "@/lib/meetups";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export type { MeetupItem };

type SortMode = "fit" | "chrono";

export function MeetupList({ items }: { items: MeetupItem[] }) {
  const [hydrated, setHydrated] = useState(false);
  const [taste, setTaste] = useState<TasteEntry[]>([]);
  const [sort, setSort] = useState<SortMode>("fit");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setTaste(loadJSON<TasteEntry[]>(STORAGE_KEYS.identity, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const fits = useMemo(() => {
    const map = new Map<string, MeetupFit>();
    for (const m of items) map.set(m.id, computeMeetupFit(taste, m.tasteFilters));
    return map;
  }, [items, taste]);

  const sorted = useMemo(() => {
    if (sort === "fit" && taste.length > 0) {
      return [...items].sort((a, b) => (fits.get(b.id)?.pct ?? 0) - (fits.get(a.id)?.pct ?? 0));
    }
    return items;
  }, [items, fits, sort, taste.length]);

  const hasTaste = taste.length > 0;

  return (
    <>
      {hydrated && hasTaste && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-[color:var(--color-muted)] mr-1">Sort by</span>
          <SortChip active={sort === "fit"} onClick={() => setSort("fit")}>
            best fit
          </SortChip>
          <SortChip active={sort === "chrono"} onClick={() => setSort("chrono")}>
            soonest
          </SortChip>
        </div>
      )}

      {hydrated && !hasTaste && (
        <Card tone="dashed" className="mb-6 text-sm text-[color:var(--color-muted)]" padded={false}>
          <div className="p-4">
            <Link href="/me" className="underline underline-offset-2 hover:text-[color:var(--color-foreground)]">
              Fill in your top 5s
            </Link>{" "}
            to see fit scores on each meetup.
          </div>
        </Card>
      )}

      <ul className="space-y-3">
        {sorted.map((m) => {
          const fit = fits.get(m.id);
          return (
            <li key={m.id}>
              <Link
                href={`/meetups/${m.id}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] rounded-2xl"
              >
                <Card className="flex flex-wrap items-start gap-6 justify-between hover:border-[color:var(--color-accent)]/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-3 mb-1">
                      <h2 className="text-lg font-semibold">{m.title}</h2>
                      {hydrated && hasTaste && fit && fit.pct > 0 && (
                        <FitBadge fit={fit} />
                      )}
                    </div>
                    <p className="text-sm text-[color:var(--color-muted)]">
                      {m.venue} · {m.city}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {m.tasteFilters.map((tag) => (
                        <Chip
                          key={tag}
                          tone={fit?.matched.includes(tag) ? "accent" : "outline"}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm">{m.when}</p>
                    <p className="text-xs text-[color:var(--color-muted)] mt-1">
                      hosted by {m.host}
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function FitBadge({ fit }: { fit: MeetupFit }) {
  const tone =
    fit.pct >= 70
      ? "bg-[color:var(--color-accent)]/20 text-[color:var(--color-foreground)]"
      : fit.pct >= 30
      ? "bg-[color:var(--color-accent)]/10 text-[color:var(--color-foreground)]"
      : "bg-[color:var(--color-card)] text-[color:var(--color-muted)] border border-[color:var(--color-border)]";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tone}`}>
      {fit.pct}% your speed
    </span>
  );
}

function SortChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
        active
          ? "bg-[color:var(--color-foreground)] text-[color:var(--color-background)]"
          : "border border-[color:var(--color-border)] hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}
