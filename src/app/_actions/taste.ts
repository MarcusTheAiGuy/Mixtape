"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasDb } from "@/lib/has-db";
import type { TasteEntry, TasteCategory } from "@/lib/taste";

export type ActionResult =
  | { ok: true }
  | { ok: false; reason: "unauthenticated" | "no-db" | "invalid"; message?: string };

const VALID_CATEGORIES = new Set<TasteCategory>([
  "ALBUM",
  "ARTIST",
  "GENRE",
  "SONG",
  "LIVE_SHOW",
]);

function sanitizeEntry(e: TasteEntry): TasteEntry | null {
  if (!VALID_CATEGORIES.has(e.category)) return null;
  if (e.position < 1 || e.position > 5) return null;
  const name = (e.name ?? "").trim().slice(0, 200);
  if (!name) return null;
  return {
    category: e.category,
    position: e.position,
    name,
    subtitle: e.subtitle ? e.subtitle.trim().slice(0, 200) : null,
    imageUrl: e.imageUrl ? e.imageUrl.slice(0, 1000) : null,
    externalId: e.externalId ? e.externalId.slice(0, 200) : null,
  };
}

/**
 * Bulk-replace the signed-in user's identity-layer top 5s. Wipes existing
 * entries and inserts the sanitized list in a single transaction.
 */
export async function replaceTaste(entries: TasteEntry[]): Promise<ActionResult> {
  if (!hasDb()) return { ok: false, reason: "no-db" };
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, reason: "unauthenticated" };

  const sanitized = entries
    .map(sanitizeEntry)
    .filter((e): e is TasteEntry => e !== null);

  // Cap total at 5 per category, defensively.
  const seen = new Map<string, TasteEntry>();
  for (const e of sanitized) {
    const key = `${e.category}:${e.position}`;
    if (!seen.has(key)) seen.set(key, e);
  }
  const toInsert = [...seen.values()];

  await prisma.$transaction([
    prisma.tasteEntry.deleteMany({ where: { userId } }),
    prisma.tasteEntry.createMany({
      data: toInsert.map((e) => ({
        userId,
        category: e.category,
        position: e.position,
        name: e.name,
        subtitle: e.subtitle,
        imageUrl: e.imageUrl,
        externalId: e.externalId,
      })),
    }),
  ]);

  revalidatePath("/me");
  revalidatePath("/discover");
  return { ok: true };
}
