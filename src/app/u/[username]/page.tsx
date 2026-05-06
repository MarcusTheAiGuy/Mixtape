import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/ProfileHeader";
import { TasteShowcase } from "@/components/TasteShowcase";
import { TasteInsights } from "@/components/TasteInsights";
import type { Profile } from "@/lib/profile";
import type { TasteEntry } from "@/lib/taste";

export const metadata = {
  title: "Profile — Mixtape",
};

// Sample data for development. Once Prisma + Auth are wired up, replace with:
//   const user = await prisma.user.findUnique({
//     where: { username },
//     include: { taste: true },
//   });
type SampleProfile = { profile: Profile; taste: TasteEntry[] };

const SAMPLE_PROFILES: Record<string, SampleProfile> = {
  marcus: {
    profile: {
      displayName: "Marcus",
      username: "marcus",
      bio: "Always chasing the next gig. Big into shoegaze right now.",
      location: "London",
      avatarDataUrl: null,
    },
    taste: [
      { category: "ALBUM", position: 1, name: "Loveless", subtitle: "My Bloody Valentine" },
      { category: "ALBUM", position: 2, name: "In Rainbows", subtitle: "Radiohead" },
      { category: "ALBUM", position: 3, name: "Dragon New Warm Mountain I Believe In You", subtitle: "Big Thief" },
      { category: "ARTIST", position: 1, name: "Big Thief" },
      { category: "ARTIST", position: 2, name: "Caroline Polachek" },
      { category: "ARTIST", position: 3, name: "Slowdive" },
      { category: "GENRE", position: 1, name: "Shoegaze" },
      { category: "GENRE", position: 2, name: "Indie folk" },
      { category: "GENRE", position: 3, name: "Dream pop" },
      { category: "SONG", position: 1, name: "Not", subtitle: "Big Thief" },
      { category: "SONG", position: 2, name: "Sometimes", subtitle: "My Bloody Valentine" },
      { category: "LIVE_SHOW", position: 1, name: "Big Thief", subtitle: "Roundhouse · 2023" },
      { category: "LIVE_SHOW", position: 2, name: "Slowdive", subtitle: "Brixton Academy · 2024" },
    ],
  },
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const sample = SAMPLE_PROFILES[username.toLowerCase()];
  if (!sample) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <ProfileHeader mode="read" profile={sample.profile} />
      <div className="mb-12">
        <TasteInsights entries={sample.taste} />
      </div>
      <TasteShowcase entries={sample.taste} />
    </div>
  );
}
