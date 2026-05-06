import { describe, expect, it } from "vitest";
import { computeMeetupFit } from "@/lib/meetup-fit";
import type { TasteEntry } from "@/lib/taste";

const e = (
  category: TasteEntry["category"],
  position: number,
  name: string,
  subtitle?: string,
): TasteEntry => ({ category, position, name, subtitle });

describe("computeMeetupFit", () => {
  it("is zero when the user has no taste yet", () => {
    const r = computeMeetupFit([], ["shoegaze"]);
    expect(r.pct).toBe(0);
    expect(r.matched).toEqual([]);
  });

  it("is zero when the meetup has no filters", () => {
    const r = computeMeetupFit([e("GENRE", 1, "Shoegaze")], []);
    expect(r.pct).toBe(0);
    expect(r.matched).toEqual([]);
  });

  it("matches case-insensitively against entry names", () => {
    const r = computeMeetupFit(
      [e("GENRE", 1, "Shoegaze")],
      ["SHOEGAZE"],
    );
    expect(r.matched).toContain("SHOEGAZE");
    expect(r.pct).toBeGreaterThan(0);
  });

  it("matches against entry subtitles (e.g. credited artist)", () => {
    const r = computeMeetupFit(
      [e("ALBUM", 1, "Loveless", "My Bloody Valentine")],
      ["My Bloody Valentine"],
    );
    expect(r.matched).toContain("My Bloody Valentine");
  });

  it("supports substring matches", () => {
    const r = computeMeetupFit(
      [e("ARTIST", 1, "Big Thief")],
      ["thief"],
    );
    expect(r.matched).toContain("thief");
  });

  it("rewards genre + artist hits more than album/song hits", () => {
    const filters = ["shoegaze"];
    const asGenre = computeMeetupFit([e("GENRE", 1, "Shoegaze")], filters);
    const asAlbum = computeMeetupFit(
      [e("ALBUM", 1, "Shoegaze Classics")],
      filters,
    );
    expect(asGenre.pct).toBeGreaterThan(asAlbum.pct);
  });

  it("rewards higher-position taste entries more", () => {
    const filters = ["shoegaze"];
    const high = computeMeetupFit([e("GENRE", 1, "Shoegaze")], filters);
    const low = computeMeetupFit([e("GENRE", 5, "Shoegaze")], filters);
    expect(high.pct).toBeGreaterThan(low.pct);
  });

  it("returns 0 for filters that don't appear anywhere", () => {
    const r = computeMeetupFit(
      [e("GENRE", 1, "Country")],
      ["shoegaze"],
    );
    expect(r.pct).toBe(0);
    expect(r.matched).toEqual([]);
  });

  it("always returns a percent in 0..100", () => {
    const taste = [
      e("GENRE", 1, "Shoegaze"),
      e("ARTIST", 1, "Slowdive"),
      e("ALBUM", 1, "Souvlaki", "Slowdive"),
    ];
    const r = computeMeetupFit(taste, ["shoegaze", "slowdive", "souvlaki"]);
    expect(r.pct).toBeGreaterThanOrEqual(0);
    expect(r.pct).toBeLessThanOrEqual(100);
  });
});
