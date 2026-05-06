"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { computeMatch, matchPercent, type MatchResult } from "@/lib/match";
import type { SampleUser } from "@/lib/sample-users";
import { STORAGE_KEYS, loadJSON } from "@/lib/local-store";
import {
  PROFILE_STORAGE_KEY,
  DEFAULT_PROFILE,
  type Profile,
} from "@/lib/profile";
import { AvatarPreview } from "@/components/AvatarUploader";
import { TextInput } from "@/components/ui/Field";
import type { TasteEntry } from "@/lib/taste";

export function DiscoverList({ users }: { users: SampleUser[] }) {
  const [hydrated, setHydrated] = useState(false);
  const [own, setOwn] = useState<TasteEntry[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOwn(loadJSON<TasteEntry[]>(STORAGE_KEYS.identity, []));
    setProfile(loadJSON<Profile>(PROFILE_STORAGE_KEY, DEFAULT_PROFILE));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Cities present in the data — used for the chip filter.
  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const u of users) if (u.profile.location) set.add(u.profile.location);
    return [...set].sort();
  }, [users]);

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = users
      .filter((u) => u.profile.username !== profile.username)
      .filter((u) => {
        if (city && u.profile.location !== city) return false;
        if (!q) return true;
        const hay = [
          u.profile.displayName,
          u.profile.username,
          u.profile.bio,
          u.profile.location,
          ...u.taste.map((t) => t.name),
          ...u.taste.map((t) => t.subtitle ?? ""),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });

    if (own.length === 0) {
      return filtered.map((u) => ({ user: u, match: null as MatchResult | null }));
    }
    return filtered
      .map((u) => ({ user: u, match: computeMatch(own, u.taste) }))
      .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
  }, [own, profile.username, users, query, city]);

  if (!hydrated) {
    return <div className="h-32 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />;
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <TextInput
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 60))}
          placeholder="Search names, genres, artists..."
          aria-label="Filter people"
          className="sm:max-w-xs"
        />
        {cities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              type="button"
              onClick={() => setCity(null)}
              aria-pressed={city === null}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                city === null
                  ? "bg-[color:var(--color-foreground)] text-[color:var(--color-background)]"
                  : "border border-[color:var(--color-border)] hover:bg-white/5"
              }`}
            >
              All cities
            </button>
            {cities.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCity(c === city ? null : c)}
                aria-pressed={city === c}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  city === c
                    ? "bg-[color:var(--color-foreground)] text-[color:var(--color-background)]"
                    : "border border-[color:var(--color-border)] hover:bg-white/5"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {own.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-6 mb-6 text-sm text-[color:var(--color-muted)]">
          <Link
            href="/me"
            className="underline underline-offset-2 hover:text-[color:var(--color-foreground)]"
          >
            Build your top 5s
          </Link>{" "}
          to unlock match scores.
        </div>
      )}

      {ranked.length === 0 ? (
        <p className="text-[color:var(--color-muted)] py-12 text-center">
          No-one matches that filter. Try a different search.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {ranked.map(({ user, match }) => (
            <DiscoverCard key={user.profile.username} user={user} match={match} />
          ))}
        </ul>
      )}
    </>
  );
}

function DiscoverCard({
  user,
  match,
}: {
  user: SampleUser;
  match: MatchResult | null;
}) {
  const pct = match ? matchPercent(match.score) : null;
  const topShared: string[] = match
    ? [
        ...match.shared.genres.slice(0, 2),
        ...match.shared.artists.slice(0, 2),
      ].slice(0, 4)
    : [];

  return (
    <li>
      <Link
        href={`/u/${user.profile.username}`}
        className="block rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-5 hover:border-[color:var(--color-accent)]/40 transition-colors group"
        style={
          user.profile.accentHex
            ? ({ ["--card-accent" as string]: user.profile.accentHex } as React.CSSProperties)
            : undefined
        }
      >
        <div className="flex items-start gap-4">
          <AvatarPreview
            value={user.profile.avatarDataUrl}
            displayName={user.profile.displayName}
            size={56}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h3 className="font-semibold truncate">{user.profile.displayName}</h3>
              {pct !== null && (
                <span className="text-sm font-semibold tabular-nums shrink-0">
                  {pct}%
                </span>
              )}
            </div>
            <p className="text-sm text-[color:var(--color-muted)] truncate">
              @{user.profile.username}
              {user.profile.location && <> · {user.profile.location}</>}
            </p>
            {user.profile.bio && (
              <p className="text-sm mt-2 line-clamp-2 text-[color:var(--color-muted)]">
                {user.profile.bio}
              </p>
            )}
            {topShared.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {topShared.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full text-xs bg-[color:var(--color-accent)]/15"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
