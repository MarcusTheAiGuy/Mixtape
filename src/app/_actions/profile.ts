"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasDb } from "@/lib/has-db";
import {
  PROFILE_LIMITS,
  isValidAccent,
  isValidUsername,
  type Profile,
} from "@/lib/profile";

export type ActionResult =
  | { ok: true }
  | { ok: false; reason: "unauthenticated" | "no-db" | "invalid"; message?: string };

function clamp(v: string | null | undefined, max: number): string {
  return (v ?? "").slice(0, max);
}

/**
 * Persist the basic profile fields for the signed-in user. Returns a
 * structured result instead of throwing so the client can show a tasteful
 * error.
 */
export async function saveProfile(input: Profile): Promise<ActionResult> {
  if (!hasDb()) return { ok: false, reason: "no-db" };
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthenticated" };

  const username = input.username.trim().toLowerCase();
  if (!isValidUsername(username)) {
    return {
      ok: false,
      reason: "invalid",
      message: "Usernames are lowercase letters, numbers, and underscores only.",
    };
  }
  if (!isValidAccent(input.accentHex)) {
    return { ok: false, reason: "invalid", message: "Pick a valid accent color." };
  }

  // Username uniqueness check (Prisma surfaces a P2002 on the unique
  // constraint, but giving a friendly error makes the UI nicer).
  if (username) {
    const taken = await prisma.user.findFirst({
      where: { username, NOT: { id: session.user.id } },
      select: { id: true },
    });
    if (taken) {
      return { ok: false, reason: "invalid", message: "That username is taken." };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: clamp(input.displayName, PROFILE_LIMITS.displayName),
      username: username || null,
      bio: clamp(input.bio, PROFILE_LIMITS.bio),
      location: clamp(input.location, PROFILE_LIMITS.location),
      // accentHex isn't on the User model yet — add when wiring Vercel Blob.
    },
  });

  revalidatePath("/me");
  if (username) revalidatePath(`/u/${username}`);
  return { ok: true };
}
