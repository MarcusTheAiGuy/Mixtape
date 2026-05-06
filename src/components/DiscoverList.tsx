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
import type { TasteEntry } from "@/lib/taste";

export function DiscoverList({ users }: { users: SampleUser[] }) {
  const [hydrated, setHydrated] = useState(false);
  const [own, setOwn] = useState<TasteEntry[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOwn(loadJSON<TasteEntry[]>(STORAGE_KEYS.identity, []));
    setProfile(loadJSON<Profile>(PROFILE_STORAGE_KEY, DEFAULT_PROFILE));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const ranked = useMemo(() => {
    if (own.length === 0) {
      return users.map((u) => ({ user: u, match: null as MatchResult | null }));
    }
    return users
      // Hide a user that happens to share the viewer's username (eg if you
      // signed up under one of the sample names)
      .filter((u) => u.profile.username !== profile.username)
      .map((u) => ({ user: u, match: computeMatch(own, u.taste) }))
      .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
  }, [own, profile.username, users]);

  if (!hydrated) {
    return <div className="h-32 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />;
  }

  if (own.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-10 text-center">
        <p className="text-lg mb-2">Add a few of your top 5s first.</p>
        <p className="text-[color:var(--color-muted)] mb-6 max-w-md mx-auto">
          Match scores need something to compare against. A handful of genres
          and artists is enough to start.
        </p>
        <Link
          href="/me"
          className="inline-flex px-4 py-2 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Build your top 5s
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {ranked.map(({ user, match }) => (
        <DiscoverCard key={user.profile.username} user={user} match={match} />
      ))}
    </ul>
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
