import type { MeetupItem } from "@/lib/meetups";
import type { WishlistShow } from "@/lib/wishlist";

/**
 * Match a wishlist item against meetup tasteFilters. Case-insensitive
 * substring match on the artist name (and optionally the city), so a
 * "Big Thief" wishlist hits a meetup tagged with "Big Thief", and a
 * "Big Thief" meetup in London surfaces to anyone with that artist on
 * their wishlist.
 *
 * Pure function, easy to test.
 */

function normalize(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

/** Meetups whose filters mention this wishlist's artist (and city if set). */
export function findMeetupsForWishlistShow(
  show: WishlistShow,
  meetups: MeetupItem[],
): MeetupItem[] {
  const artist = normalize(show.artist);
  if (!artist) return [];
  const city = normalize(show.city);

  return meetups.filter((m) => {
    const filters = m.tasteFilters.map(normalize);
    const matchesArtist = filters.some(
      (f) => f.includes(artist) || artist.includes(f),
    );
    if (!matchesArtist) return false;
    if (!city) return true;
    return normalize(m.city) === city;
  });
}

/** Wishlist shows whose artist matches at least one filter on this meetup. */
export function findWishlistShowsForMeetup(
  meetup: MeetupItem,
  shows: WishlistShow[],
): WishlistShow[] {
  const filters = meetup.tasteFilters.map(normalize);
  if (filters.length === 0) return [];

  return shows.filter((show) => {
    const artist = normalize(show.artist);
    if (!artist) return false;
    return filters.some((f) => f.includes(artist) || artist.includes(f));
  });
}
