"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ORDERED_CATEGORIES, type TasteEntry } from "@/lib/taste";
import { TopFiveCategory } from "@/components/TopFiveCategory";
import { TasteShowcase } from "@/components/TasteShowcase";
import { TasteInsights } from "@/components/TasteInsights";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileTheme } from "@/components/ProfileTheme";
import { MoodEditor } from "@/components/MoodEditor";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ProgressNudge } from "@/components/EmptyNudge";
import { STORAGE_KEYS, loadJSON, saveJSON } from "@/lib/local-store";
import {
  DEFAULT_PROFILE,
  PROFILE_STORAGE_KEY,
  type Profile,
} from "@/lib/profile";

const SLOT_COUNT = 5;
const emptySlots = (): (TasteEntry | null)[] =>
  Array.from({ length: SLOT_COUNT }, () => null);

export function MeProfileEditor() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [entries, setEntries] = useState<TasteEntry[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setProfile(loadJSON<Profile>(PROFILE_STORAGE_KEY, DEFAULT_PROFILE));
    setEntries(loadJSON<TasteEntry[]>(STORAGE_KEYS.identity, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(PROFILE_STORAGE_KEY, profile);
  }, [profile, hydrated]);

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
        <strong className="font-semibold">Local preview.</strong> Profile, top
        5s, and avatar all save in this browser only for now. They&apos;ll move
        to your account once auth + database are connected.
      </div>

      <ProfileHeader mode="edit" profile={profile} onChange={setProfile} />

      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-2">Your top 5s</h2>
      <p className="text-[color:var(--color-muted)] mb-6 max-w-xl">
        Drop in whatever comes to mind. Half-filled is fine — anything you add
        helps us match you with the right people.
      </p>

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

      <ProgressNudge filled={entries.length} />

      <h2 className="text-2xl font-semibold tracking-tight mt-16 mb-2">Insights</h2>
      <p className="text-[color:var(--color-muted)] mb-6 max-w-xl">
        Patterns we see in your picks. The more you fill in, the more this
        layer wakes up.
      </p>
      <TasteInsights entries={entries} />

      <div className="mt-16 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">This month&apos;s mood</h2>
            <p className="text-[color:var(--color-muted)] mt-1 max-w-xl">
              Lighter than your identity top 5s — just whatever&apos;s on
              rotation right now.
            </p>
          </div>
          <Link
            href="/me/diary"
            className="text-sm underline underline-offset-2 text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
          >
            See diary →
          </Link>
        </div>
        <MoodEditor />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight mt-16 mb-2">
        Public preview
      </h2>
      <p className="text-[color:var(--color-muted)] mb-6 max-w-xl">
        How your profile looks to others.{" "}
        {profile.username && (
          <>
            Live at{" "}
            <Link
              href={`/u/${profile.username}`}
              className="underline underline-offset-2 hover:text-[color:var(--color-foreground)]"
            >
              /u/{profile.username}
            </Link>
            .
          </>
        )}
      </p>
      <ProfileTheme accentHex={profile.accentHex}>
        <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6 md:p-10">
          <ProfileHeader mode="read" profile={profile} />
          <TasteShowcase
            entries={entries}
            emptyHint="Pick your first album above to start filling this in."
          />
        </div>
      </ProfileTheme>

      <OnboardingModal />
    </>
  );
}
