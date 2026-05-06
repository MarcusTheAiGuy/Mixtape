import { describe, expect, it } from "vitest";
import { computeInsights } from "@/lib/insights";
import type { TasteEntry } from "@/lib/taste";

const e = (
  category: TasteEntry["category"],
  position: number,
  name: string,
  subtitle?: string,
): TasteEntry => ({ category, position, name, subtitle });

describe("computeInsights", () => {
  it("reports 0 completion for an empty profile", () => {
    const r = computeInsights([]);
    expect(r.totalFilled).toBe(0);
    expect(r.completion).toBe(0);
    expect(r.vibe).toBeNull();
    expect(r.crossovers).toEqual([]);
  });

  it("reports completion as filled / 25", () => {
    const entries = Array.from({ length: 5 }, (_, i) => e("GENRE", i + 1, `g${i}`));
    const r = computeInsights(entries);
    expect(r.totalFilled).toBe(5);
    expect(r.totalSlots).toBe(25);
    expect(r.completion).toBeCloseTo(0.2, 5);
    expect(r.perCategory.GENRE).toBe(5);
  });

  it("never reports completion above 1", () => {
    const entries = Array.from({ length: 30 }, (_, i) =>
      e("GENRE", (i % 5) + 1, `g${i}`),
    );
    const r = computeInsights(entries);
    expect(r.completion).toBeLessThanOrEqual(1);
  });

  it("derives a vibe blurb from genre keywords", () => {
    const r = computeInsights([
      e("GENRE", 1, "Shoegaze"),
      e("GENRE", 2, "Indie folk"),
    ]);
    expect(r.vibe).not.toBeNull();
    // Vibe words come from the keyword map for those genres
    expect(r.vibe).toMatch(/hazy|plainspoken|earthy|wall-of-sound/);
  });

  it("falls back to listing genres when no keywords match", () => {
    const r = computeInsights([
      e("GENRE", 1, "Some Niche Genre"),
      e("GENRE", 2, "Another Obscure One"),
    ]);
    expect(r.vibe).toContain("some niche genre");
  });

  it("weights top genres higher than lower-position ones", () => {
    const r = computeInsights([
      e("GENRE", 1, "First"),
      e("GENRE", 5, "Last"),
    ]);
    const first = r.topGenres.find((g) => g.name === "First");
    const last = r.topGenres.find((g) => g.name === "Last");
    expect(first?.weight).toBeGreaterThan(last?.weight ?? 0);
  });

  it("surfaces artists that appear across categories as crossovers", () => {
    const r = computeInsights([
      e("ARTIST", 1, "Big Thief"),
      e("ALBUM", 1, "Two Hands", "Big Thief"),
      e("LIVE_SHOW", 1, "Big Thief"),
    ]);
    expect(r.crossovers.length).toBeGreaterThan(0);
    expect(r.crossovers[0].name).toBe("Big Thief");
    expect(new Set(r.crossovers[0].appearances.map((a) => a.category)).size).toBeGreaterThanOrEqual(2);
  });

  it("does not flag a single-category appearance as a crossover", () => {
    const r = computeInsights([
      e("ARTIST", 1, "Big Thief"),
      e("ARTIST", 2, "Slowdive"),
    ]);
    expect(r.crossovers).toEqual([]);
  });
});
