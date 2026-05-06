import type { TasteEntry } from "@/lib/taste";
import { currentMonthKey } from "@/lib/taste";

export type MoodSnapshot = {
  monthKey: string;
  entries: TasteEntry[];
  note?: string;
  updatedAt: string; // ISO
};

export const MOOD_STORAGE_KEY = "mixtape:mood:archive";

export function formatMonth(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return monthKey;
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export function isCurrentMonth(monthKey: string): boolean {
  return monthKey === currentMonthKey();
}

export function sortByMonthDesc<T extends { monthKey: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}
