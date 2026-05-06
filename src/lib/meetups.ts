/**
 * Sample meetup data shown until the DB is connected. Mirrors the shape of
 * what `prisma.meetup.findMany(...)` will return, plus a friendly `when`
 * string and a `host` username so meetup pages don't need a join.
 */
export type MeetupItem = {
  id: string;
  title: string;
  description?: string;
  venue: string;
  city: string;
  when: string;
  host: string; // username of the host (links to /u/[host])
  tasteFilters: string[];
  attendees?: string[]; // usernames
};

export const SAMPLE_MEETUPS: MeetupItem[] = [
  {
    id: "1",
    title: "Listening party: new album drop",
    description:
      "Bring whatever's been on rotation. Loud speakers, low lights, no phones for the first half-hour.",
    venue: "The Lock Tavern",
    city: "London",
    when: "Fri, May 9 · 8pm",
    host: "marcus",
    tasteFilters: ["shoegaze", "dream pop", "Slowdive"],
    attendees: ["alex", "noor"],
  },
  {
    id: "2",
    title: "Vinyl swap & coffee",
    description:
      "Bring 5 records you'd be happy to part with. Soft trades, no pressure to leave with anything.",
    venue: "Climpson & Sons",
    city: "London",
    when: "Sun, May 11 · 11am",
    host: "riley",
    tasteFilters: ["soul", "jazz", "Erykah Badu"],
    attendees: ["jamie"],
  },
  {
    id: "3",
    title: "Looking for a +1 to Big Thief",
    description:
      "I've got a spare ticket and don't want to go alone. Cash or PayPal at face value.",
    venue: "Roundhouse",
    city: "London",
    when: "Sat, May 24 · 7pm",
    host: "marcus",
    tasteFilters: ["Big Thief", "indie folk"],
    attendees: [],
  },
];

export function getSampleMeetup(id: string): MeetupItem | null {
  return SAMPLE_MEETUPS.find((m) => m.id === id) ?? null;
}
