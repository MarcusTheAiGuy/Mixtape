import { describe, expect, it } from "vitest";
import { computeMatch, matchPercent } from "@/lib/match";
import type { TasteEntry } from "@/lib/taste";

const e = (
  category: TasteEntry["category"],
  position: number,
  name: string,
  subtitle?: string,
): TasteEntry => ({ category, position, name, subtitle });

describe("computeMatch", () => {
  it("returns zero for two empty profiles", () => {
    const r = computeMatch([], []);
    expect(r.score).toBe(0);
    expect(r.totalShared).toBe(0);
  });

  it("returns zero when one side is empty", () => {
    const r = computeMatch([e("GENRE", 1, "Shoegaze")], []);
    expect(r.score).toBe(0);
  });

  it("returns a high score for identical profiles", () => {
    const taste = [
      e("GENRE", 1, "Shoegaze"),
      e("GENRE", 2, "Indie folk"),
      e("ARTIST", 1, "Big Thief"),
      e("ALBUM", 1, "Loveless", "My Bloody Valentine"),
    ];
    const r = computeMatch(taste, taste);
    expect(r.score).toBe(1);
    expect(matchPercent(r.score)).toBe(100);
  });

  it("returns zero when nothing overlaps", () => {
    const a = [e("GENRE", 1, "Shoegaze"), e("ARTIST", 1, "Slowdive")];
    const b = [e("GENRE", 1, "Country"), e("ARTIST", 1, "Tyler Childers")];
    const r = computeMatch(a, b);
    expect(r.score).toBe(0);
    expect(r.totalShared).toBe(0);
  });

  it("normalizes case + whitespace when matching names", () => {
    const a = [e("ARTIST", 1, "BIG THIEF")];
    const b = [e("ARTIST", 2, "  big thief ")];
    const r = computeMatch(a, b);
    expect(r.shared.artists.length).toBe(1);
    expect(r.score).toBeGreaterThan(0);
  });

  it("counts an album's credited artist into the artist lane", () => {
    const a = [e("ARTIST", 1, "Big Thief")];
    const b = [e("ALBUM", 1, "Two Hands", "Big Thief")];
    const r = computeMatch(a, b);
    expect(r.shared.artists).toContain("Big Thief");
    expect(r.score).toBeGreaterThan(0);
  });

  it("weights position-1 picks more heavily than position-5", () => {
    const a = [e("GENRE", 1, "Shoegaze"), e("GENRE", 2, "Pop")];
    const high = [e("GENRE", 1, "Shoegaze")]; // matches at top weight
    const low = [e("GENRE", 5, "Shoegaze")]; // matches at bottom weight

    const rHigh = computeMatch(a, high);
    const rLow = computeMatch(a, low);
    expect(rHigh.score).toBeGreaterThan(rLow.score);
  });

  it("groups shared items by lane", () => {
    const a = [
      e("GENRE", 1, "Shoegaze"),
      e("ARTIST", 1, "Slowdive"),
      e("ALBUM", 1, "Souvlaki", "Slowdive"),
    ];
    const b = [
      e("GENRE", 1, "Shoegaze"),
      e("ARTIST", 1, "Slowdive"),
      e("SONG", 1, "Alison", "Slowdive"),
    ];
    const r = computeMatch(a, b);
    expect(r.shared.genres).toContain("Shoegaze");
    expect(r.shared.artists.length).toBeGreaterThanOrEqual(1);
    expect(r.shared.albums).toEqual([]);
    expect(r.shared.songs).toEqual([]);
  });

  it("preserves the original casing of shared items in output", () => {
    const a = [e("GENRE", 1, "Indie Folk")];
    const b = [e("GENRE", 1, "indie folk")];
    const r = computeMatch(a, b);
    // Should pick whichever side's display value, both valid casings
    expect(r.shared.genres[0].toLowerCase()).toBe("indie folk");
  });
});

describe("matchPercent", () => {
  it("clamps scores into 0..100 integers", () => {
    expect(matchPercent(0)).toBe(0);
    expect(matchPercent(1)).toBe(100);
    expect(matchPercent(0.4)).toBe(100); // stretched calibration
    expect(matchPercent(0.2)).toBe(50);
  });
});
