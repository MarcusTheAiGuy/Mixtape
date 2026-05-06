/**
 * Tiny localStorage helpers used in **demo mode** (no auth + no DB) — and as
 * a sensible fallback for unauthenticated visitors once the real backend is
 * connected. See `docs/architecture.md` for the dual-path persistence model
 * and `src/app/_actions/*` for the server-side equivalents.
 */

import type { TasteEntry } from "@/lib/taste";
import type { WishlistShow } from "@/lib/wishlist";

/** Stable localStorage keys. Bump these to invalidate old client data. */
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
