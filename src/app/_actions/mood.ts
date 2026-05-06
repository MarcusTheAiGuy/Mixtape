"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasDb } from "@/lib/has-db";
import type { TasteCategory, TasteEntry } from "@/lib/taste";

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

const MONTH_KEY_RE = /^\d{4}-\d{2}$/;

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

/** Replace the mood snapshot for `monthKey` (YYYY-MM). */
export async function replaceMonthMood(
  monthKey: string,
  entries: TasteEntry[],
): Promise<ActionResult> {
  if (!hasDb()) return { ok: false, reason: "no-db" };
  if (!MONTH_KEY_RE.test(monthKey)) {
    return { ok: false, reason: "invalid", message: "Bad month key." };
  }
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, reason: "unauthenticated" };

  const sanitized = entries
    .map(sanitizeEntry)
    .filter((e): e is TasteEntry => e !== null);

  await prisma.$transaction([
    prisma.moodEntry.deleteMany({
      where: { userId, monthKey },
    }),
    prisma.moodEntry.createMany({
      data: sanitized.map((e) => ({
        userId,
        monthKey,
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
  revalidatePath("/me/diary");
  return { ok: true };
}
