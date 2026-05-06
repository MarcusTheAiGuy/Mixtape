"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { computeMatch, matchPercent, type MatchResult } from "@/lib/match";
import { STORAGE_KEYS, loadJSON } from "@/lib/local-store";
import type { TasteEntry } from "@/lib/taste";

type Props = {
  targetUsername: string;
  targetTaste: TasteEntry[];
};

// Reads the viewer's own taste from localStorage and shows overlap with the
// profile they're looking at. Renders nothing if the viewer hasn't filled
// anything in or if there's no overlap.
export function MatchInCommon({ targetUsername, targetTaste }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [own, setOwn] = useState<TasteEntry[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOwn(loadJSON<TasteEntry[]>(STORAGE_KEYS.identity, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!hydrated) return null;

  if (own.length === 0) {
    return (
      <aside className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-5 mb-8 text-sm text-[color:var(--color-muted)]">
        <p>
          Want to see what you and {targetUsername} have in common?{" "}
          <Link href="/me" className="underline underline-offset-2 hover:text-[color:var(--color-foreground)]">
            Build your top 5s
          </Link>{" "}
          first.
        </p>
      </aside>
    );
  }

  const match = computeMatch(own, targetTaste);
  if (match.totalShared === 0) {
    return (
      <aside className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-5 mb-8 text-sm">
        <p className="text-[color:var(--color-muted)]">
          Nothing obvious in common — but maybe that&apos;s the fun part.
        </p>
      </aside>
    );
  }

  return <CommonBanner match={match} username={targetUsername} />;
}

function CommonBanner({ match, username }: { match: MatchResult; username: string }) {
  const pct = matchPercent(match.score);
  const lanes: { label: string; items: string[] }[] = [
    { label: "Genres", items: match.shared.genres },
    { label: "Artists", items: match.shared.artists },
    { label: "Albums", items: match.shared.albums },
    { label: "Songs", items: match.shared.songs },
    { label: "Live shows", items: match.shared.liveShows },
  ].filter((l) => l.items.length > 0);

  return (
    <aside className="rounded-2xl border border-[color:var(--color-accent)]/40 bg-gradient-to-br from-[color:var(--color-accent)]/10 to-transparent p-5 md:p-6 mb-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold">
          You and {username}{" "}
          <span className="text-[color:var(--color-muted)] font-normal">share</span>
        </h2>
        <span className="text-2xl font-semibold tabular-nums">
          {pct}% <span className="text-sm text-[color:var(--color-muted)] font-normal">match</span>
        </span>
      </div>
      <ul className="space-y-2">
        {lanes.map((lane) => (
          <li key={lane.label} className="flex flex-wrap items-baseline gap-2">
            <span className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] w-20 shrink-0">
              {lane.label}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {lane.items.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded-full text-xs bg-[color:var(--color-accent)]/15 text-[color:var(--color-foreground)]"
                >
                  {item}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
