import "server-only";

import { prisma } from "@/lib/prisma";
import { hasDb } from "@/lib/has-db";
import { SAMPLE_USERS, SAMPLE_USERS_BY_USERNAME, type SampleUser } from "@/lib/sample-users";
import type { Profile } from "@/lib/profile";
import type { TasteEntry } from "@/lib/taste";

/**
 * Server-side reads with a clean fallback to sample data when the DB isn't
 * provisioned (so the demo flow works for /u/[username] and /discover before
 * Neon is wired up).
 */

type DbUser = {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  image: string | null;
  taste: {
    category: "ALBUM" | "ARTIST" | "GENRE" | "SONG" | "LIVE_SHOW";
    position: number;
    name: string;
    subtitle: string | null;
    imageUrl: string | null;
    externalId: string | null;
  }[];
};

function toSampleShape(u: DbUser): SampleUser {
  const profile: Profile = {
    displayName: u.name ?? "",
    username: u.username ?? "",
    bio: u.bio ?? "",
    location: u.location ?? "",
    avatarDataUrl: u.image,
    accentHex: null,
  };
  const taste: TasteEntry[] = u.taste.map((t) => ({
    category: t.category,
    position: t.position,
    name: t.name,
    subtitle: t.subtitle,
    imageUrl: t.imageUrl,
    externalId: t.externalId,
  }));
  return { profile, taste };
}

/** Look up a profile by username. Returns null if not found. */
export async function getUserByUsername(
  username: string,
): Promise<SampleUser | null> {
  if (!hasDb()) {
    return SAMPLE_USERS_BY_USERNAME[username.toLowerCase()] ?? null;
  }
  const u = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      location: true,
      image: true,
      taste: {
        select: {
          category: true,
          position: true,
          name: true,
          subtitle: true,
          imageUrl: true,
          externalId: true,
        },
      },
    },
  });
  if (!u) return null;
  return toSampleShape(u as DbUser);
}

/** All users with a username, for /discover. Falls back to SAMPLE_USERS. */
export async function listDiscoverableUsers(
  excludeUserId?: string,
): Promise<SampleUser[]> {
  if (!hasDb()) {
    return SAMPLE_USERS;
  }
  const users = await prisma.user.findMany({
    where: {
      username: { not: null },
      ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
    },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      location: true,
      image: true,
      taste: {
        select: {
          category: true,
          position: true,
          name: true,
          subtitle: true,
          imageUrl: true,
          externalId: true,
        },
      },
    },
    take: 100,
  });
  if (users.length === 0) return SAMPLE_USERS;
  return (users as DbUser[]).map(toSampleShape);
}
