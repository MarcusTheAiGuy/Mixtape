import Link from "next/link";
import { MeetupList, type MeetupItem } from "@/components/MeetupList";

export const metadata = {
  title: "Meetups — Mixtape",
};

const sampleMeetups: MeetupItem[] = [
  {
    id: "1",
    title: "Listening party: new album drop",
    venue: "The Lock Tavern",
    city: "London",
    when: "Fri, May 9 · 8pm",
    host: "marcus",
    tasteFilters: ["shoegaze", "dream pop", "Slowdive"],
  },
  {
    id: "2",
    title: "Vinyl swap & coffee",
    venue: "Climpson & Sons",
    city: "London",
    when: "Sun, May 11 · 11am",
    host: "friend",
    tasteFilters: ["soul", "jazz", "Erykah Badu"],
  },
  {
    id: "3",
    title: "Looking for a +1 to Big Thief",
    venue: "Roundhouse",
    city: "London",
    when: "Sat, May 24 · 7pm",
    host: "marcus",
    tasteFilters: ["Big Thief", "indie folk"],
  },
];

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

      <MeetupList items={sampleMeetups} />
    </div>
  );
}
