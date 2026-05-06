"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasDb } from "@/lib/has-db";
import type { WishlistShow } from "@/lib/wishlist";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; reason: "unauthenticated" | "no-db" | "invalid"; message?: string };

function clamp(v: string | null | undefined, max: number): string | null {
  if (!v) return null;
  const trimmed = v.trim().slice(0, max);
  return trimmed || null;
}

/** Add a future show the signed-in user wants to go to. */
export async function addWishlistShow(
  input: Omit<WishlistShow, "id" | "createdAt">,
): Promise<ActionResult> {
  if (!hasDb()) return { ok: false, reason: "no-db" };
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" };

  const artist = clamp(input.artist, 200);
  if (!artist) {
    return { ok: false, reason: "invalid", message: "An artist name is required." };
  }

  const created = await prisma.wishlistShow.create({
    data: {
      userId: session.user.id,
      artist,
      tourName: clamp(input.tourName, 200),
      venue: clamp(input.venue, 200),
      city: clamp(input.city, 120),
      date: input.date ? new Date(input.date) : null,
      url: clamp(input.url, 1000),
      notes: clamp(input.notes, 500),
    },
    select: { id: true },
  });

  revalidatePath("/wishlist");
  return { ok: true, id: created.id };
}

export async function removeWishlistShow(id: string): Promise<ActionResult> {
  if (!hasDb()) return { ok: false, reason: "no-db" };
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" };

  // Scope the delete to the caller — never let a user delete someone else's show.
  await prisma.wishlistShow.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/wishlist");
  return { ok: true };
}
