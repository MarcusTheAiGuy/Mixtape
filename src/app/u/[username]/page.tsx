import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/ProfileHeader";
import { TasteShowcase } from "@/components/TasteShowcase";
import { TasteInsights } from "@/components/TasteInsights";
import { MatchInCommon } from "@/components/MatchInCommon";
import { ProfileTheme } from "@/components/ProfileTheme";
import { getUserByUsername } from "@/lib/data/users";

export const metadata = {
  title: "Profile — Mixtape",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  return (
    <ProfileTheme accentHex={user.profile.accentHex}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ProfileHeader mode="read" profile={user.profile} />
        <MatchInCommon
          targetUsername={user.profile.username}
          targetTaste={user.taste}
        />
        <div className="mb-12">
          <TasteInsights entries={user.taste} />
        </div>
        <TasteShowcase entries={user.taste} />
      </div>
    </ProfileTheme>
  );
}
