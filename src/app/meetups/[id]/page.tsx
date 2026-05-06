import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MeetupFitBanner } from "@/components/MeetupFitBanner";
import { WishlistMatchHint } from "@/components/WishlistMatchHint";
import { AvatarPreview } from "@/components/AvatarUploader";
import { getSampleMeetup } from "@/lib/meetups";
import { SAMPLE_USERS_BY_USERNAME } from "@/lib/sample-users";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetup = getSampleMeetup(id);
  return {
    title: meetup ? `${meetup.title} — Mixtape` : "Meetup — Mixtape",
  };
}

export default async function MeetupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetup = getSampleMeetup(id);
  if (!meetup) notFound();

  const host = SAMPLE_USERS_BY_USERNAME[meetup.host.toLowerCase()];
  const attendees = (meetup.attendees ?? [])
    .map((u) => SAMPLE_USERS_BY_USERNAME[u.toLowerCase()])
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/meetups"
        className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
      >
        ← All meetups
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{meetup.title}</h1>
        <p className="mt-3 text-lg text-[color:var(--color-muted)]">
          {meetup.venue} · {meetup.city}
        </p>
        <p className="mt-1 text-[color:var(--color-muted)]">{meetup.when}</p>
      </header>

      <WishlistMatchHint meetup={meetup} />
      <MeetupFitBanner filters={meetup.tasteFilters} />

      {meetup.description && (
        <Card tone="soft" className="mb-6">
          <p className="leading-relaxed">{meetup.description}</p>
        </Card>
      )}

      <section className="mb-8">
        <SectionLabel className="mb-3">For fans of</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {meetup.tasteFilters.map((tag) => (
            <Chip key={tag} tone="outline">
              {tag}
            </Chip>
          ))}
        </div>
      </section>

      {host && (
        <section className="mb-8">
          <SectionLabel className="mb-3">Hosted by</SectionLabel>
          <Link
            href={`/u/${host.profile.username}`}
            className="inline-flex items-center gap-3 group"
          >
            <AvatarPreview
              value={host.profile.avatarDataUrl}
              displayName={host.profile.displayName}
              size={40}
            />
            <span>
              <span className="block font-medium group-hover:underline underline-offset-2">
                {host.profile.displayName}
              </span>
              <span className="block text-sm text-[color:var(--color-muted)]">
                @{host.profile.username}
                {host.profile.location && <> · {host.profile.location}</>}
              </span>
            </span>
          </Link>
        </section>
      )}

      <section className="mb-8">
        <SectionLabel className="mb-3">
          {attendees.length === 0
            ? "No-one's signed up yet"
            : `${attendees.length} going`}
        </SectionLabel>
        {attendees.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {attendees.map((a) => (
              <li key={a.profile.username}>
                <Link
                  href={`/u/${a.profile.username}`}
                  className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition-colors"
                >
                  <AvatarPreview
                    value={a.profile.avatarDataUrl}
                    displayName={a.profile.displayName}
                    size={32}
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{a.profile.displayName}</p>
                    <p className="text-xs text-[color:var(--color-muted)] truncate">
                      @{a.profile.username}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-[color:var(--color-border)]">
        <button
          type="button"
          disabled
          title="Sign in to RSVP — coming once auth is live"
          className="px-5 py-3 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] font-medium opacity-40 cursor-not-allowed"
        >
          I&apos;m in
        </button>
        <button
          type="button"
          disabled
          title="Sign in to message the host — coming once auth is live"
          className="px-5 py-3 rounded-full border border-[color:var(--color-border)] opacity-60 cursor-not-allowed"
        >
          Message host
        </button>
      </div>
    </div>
  );
}
