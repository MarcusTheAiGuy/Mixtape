import { describe, expect, it } from "vitest";
import {
  findMeetupsForWishlistShow,
  findWishlistShowsForMeetup,
} from "@/lib/wishlist-meetup-link";
import type { MeetupItem } from "@/lib/meetups";
import type { WishlistShow } from "@/lib/wishlist";

const meetup = (
  id: string,
  filters: string[],
  city = "London",
): MeetupItem => ({
  id,
  title: `meetup-${id}`,
  venue: "venue",
  city,
  when: "tbd",
  host: "host",
  tasteFilters: filters,
});

const show = (artist: string, city?: string): WishlistShow => ({
  id: artist,
  artist,
  city: city ?? null,
});

describe("findMeetupsForWishlistShow", () => {
  it("matches case-insensitively", () => {
    const m = meetup("1", ["Big Thief"]);
    const out = findMeetupsForWishlistShow(show("BIG THIEF"), [m]);
    expect(out).toEqual([m]);
  });

  it("matches partial overlaps in either direction", () => {
    const m = meetup("1", ["Thief"]); // shorter filter
    const out = findMeetupsForWishlistShow(show("Big Thief"), [m]);
    expect(out).toEqual([m]);
  });

  it("filters by city when the wishlist has one set", () => {
    const inLondon = meetup("1", ["Big Thief"], "London");
    const inBerlin = meetup("2", ["Big Thief"], "Berlin");
    const out = findMeetupsForWishlistShow(
      show("Big Thief", "London"),
      [inLondon, inBerlin],
    );
    expect(out).toEqual([inLondon]);
  });

  it("returns empty when artist is blank", () => {
    expect(findMeetupsForWishlistShow(show(""), [meetup("1", ["x"])])).toEqual(
      [],
    );
  });
});

describe("findWishlistShowsForMeetup", () => {
  it("returns shows whose artist hits a filter", () => {
    const m = meetup("1", ["shoegaze", "Slowdive"]);
    const out = findWishlistShowsForMeetup(m, [
      show("Slowdive"),
      show("Big Thief"),
    ]);
    expect(out.map((s) => s.artist)).toEqual(["Slowdive"]);
  });

  it("returns empty when meetup has no filters", () => {
    const m = meetup("1", []);
    expect(findWishlistShowsForMeetup(m, [show("Slowdive")])).toEqual([]);
  });
});
