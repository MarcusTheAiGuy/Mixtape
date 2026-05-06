// Tiny localStorage helpers used while auth + DB aren't connected yet.
// Once `npm run db:push` is done and NextAuth is wired to a session,
// swap callers to server actions backed by Prisma.

import type { TasteEntry } from "@/lib/taste";
import type { WishlistShow } from "@/lib/wishlist";

export const STORAGE_KEYS = {
  identity: "mixtape:taste:identity",
  mood: (monthKey: string) => `mixtape:taste:mood:${monthKey}`,
  wishlist: "mixtape:wishlist",
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export type IdentityTaste = TasteEntry[];
export type WishlistStore = WishlistShow[];
