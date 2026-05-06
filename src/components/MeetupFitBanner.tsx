"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { computeMeetupFit, type MeetupFit } from "@/lib/meetup-fit";
import { STORAGE_KEYS, loadJSON } from "@/lib/local-store";
import type { TasteEntry } from "@/lib/taste";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

/**
 * Reads the viewer's taste from localStorage and shows how well a single
 * meetup fits. Used at the top of /meetups/[id].
 */
export function MeetupFitBanner({ filters }: { filters: string[] }) {
  const [hydrated, setHydrated] = useState(false);
  const [taste, setTaste] = useState<TasteEntry[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setTaste(loadJSON<TasteEntry[]>(STORAGE_KEYS.identity, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!hydrated) return null;

  if (taste.length === 0) {
    return (
      <Card tone="dashed" className="mb-6 text-sm text-[color:var(--color-muted)]">
        <Link
          href="/me"
          className="underline underline-offset-2 hover:text-[color:var(--color-foreground)]"
        >
          Build your top 5s
        </Link>{" "}
        to see how well this meetup matches your taste.
      </Card>
    );
  }

  const fit: MeetupFit = computeMeetupFit(taste, filters);
  if (fit.pct === 0) {
    return (
      <Card tone="soft" className="mb-6 text-sm text-[color:var(--color-muted)]">
        Nothing in your top 5s lines up with this one — but novelty isn&apos;t
        a bug, it&apos;s a feature.
      </Card>
    );
  }

  return (
    <Card
      tone="soft"
      className="mb-6 border-[color:var(--color-accent)]/40 bg-gradient-to-br from-[color:var(--color-accent)]/10 to-transparent"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
        <p className="font-semibold">{fit.pct}% your speed</p>
        <span className="text-xs text-[color:var(--color-muted)]">
          based on your top 5s
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {fit.matched.map((tag) => (
          <Chip key={tag} tone="accent">
            {tag}
          </Chip>
        ))}
      </div>
    </Card>
  );
}
