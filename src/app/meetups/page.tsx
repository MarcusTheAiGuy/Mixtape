import Link from "next/link";
import { MeetupList } from "@/components/MeetupList";
import { SAMPLE_MEETUPS } from "@/lib/meetups";

export const metadata = {
  title: "Meetups — Mixtape",
};

export default function MeetupsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Meetups</h1>
          <p className="mt-2 text-[color:var(--color-muted)] max-w-xl">
            Listening parties, record swaps, gigs — small rooms, good people.
            Each meetup is tagged with the taste it&apos;s for, so you only see what fits.
          </p>
        </div>
        <Link
          href="/meetups/new"
          className="px-4 py-2 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Host a meetup
        </Link>
      </div>

      <MeetupList items={SAMPLE_MEETUPS} />
    </div>
  );
}
