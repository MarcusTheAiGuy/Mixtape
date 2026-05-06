import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/ProfileHeader";
import { TasteShowcase } from "@/components/TasteShowcase";
import { TasteInsights } from "@/components/TasteInsights";
import { MatchInCommon } from "@/components/MatchInCommon";
import { ProfileTheme } from "@/components/ProfileTheme";
import { SAMPLE_USERS_BY_USERNAME } from "@/lib/sample-users";

export const metadata = {
  title: "Profile — Mixtape",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const sample = SAMPLE_USERS_BY_USERNAME[username.toLowerCase()];
  if (!sample) notFound();

  return (
    <ProfileTheme accentHex={sample.profile.accentHex}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ProfileHeader mode="read" profile={sample.profile} />
        {/* Client island — reads viewer's taste from localStorage and shows overlap */}
        <MatchInCommon
          targetUsername={sample.profile.username}
          targetTaste={sample.taste}
        />
        <div className="mb-12">
          <TasteInsights entries={sample.taste} />
        </div>
        <TasteShowcase entries={sample.taste} />
      </div>
    </ProfileTheme>
  );
}
