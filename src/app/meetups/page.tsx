import Link from "next/link";

export const metadata = {
  title: "Meetups — Mixtape",
};

const sampleMeetups = [
  {
    id: "1",
    title: "Listening party: new album drop",
    venue: "The Lock Tavern",
    city: "London",
    when: "Fri, May 9 · 8pm",
    host: "marcus",
  },
  {
    id: "2",
    title: "Vinyl swap & coffee",
    venue: "Climpson & Sons",
    city: "London",
    when: "Sun, May 11 · 11am",
    host: "friend",
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
          </p>
        </div>
        <Link
          href="/meetups/new"
          className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
        >
          Host a meetup
        </Link>
      </div>

      <ul className="space-y-3">
        {sampleMeetups.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 flex flex-wrap items-center gap-6 justify-between hover:border-indigo-400/40 transition-colors"
          >
            <div>
              <h2 className="text-lg font-semibold">{m.title}</h2>
              <p className="text-sm text-[color:var(--color-muted)] mt-1">
                {m.venue} · {m.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">{m.when}</p>
              <p className="text-xs text-[color:var(--color-muted)] mt-1">hosted by {m.host}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
