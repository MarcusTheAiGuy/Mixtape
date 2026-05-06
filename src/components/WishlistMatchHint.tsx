"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { STORAGE_KEYS, loadJSON } from "@/lib/local-store";
import type { MeetupItem } from "@/lib/meetups";
import type { WishlistShow } from "@/lib/wishlist";
import { findWishlistShowsForMeetup } from "@/lib/wishlist-meetup-link";

/**
 * Reads the viewer's wishlist from localStorage and shows a small hint on
 * the meetup detail page when one of their wishlisted artists is on this
 * meetup's filter list.
 */
export function WishlistMatchHint({ meetup }: { meetup: MeetupItem }) {
  const [hydrated, setHydrated] = useState(false);
  const [shows, setShows] = useState<WishlistShow[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setShows(loadJSON<WishlistShow[]>(STORAGE_KEYS.wishlist, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!hydrated) return null;
  const matches = findWishlistShowsForMeetup(meetup, shows);
  if (matches.length === 0) return null;

  return (
    <Card
      tone="soft"
      className="mb-6 border-[color:var(--color-accent-2)]/40 bg-gradient-to-br from-[color:var(--color-accent-2)]/10 to-transparent"
    >
      <p className="text-sm font-medium mb-2">
        On your wishlist:{" "}
        {matches.map((s, i) => (
          <span key={s.id}>
            <span className="font-semibold">{s.artist}</span>
            {i < matches.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <p className="text-sm text-[color:var(--color-muted)]">
        You&apos;re already keen — this meetup might be your kind of crowd.{" "}
        <Link
          href="/wishlist"
          className="underline underline-offset-2 hover:text-[color:var(--color-foreground)]"
        >
          Manage wishlist
        </Link>
      </p>
    </Card>
  );
}
