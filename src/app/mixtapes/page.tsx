import Link from "next/link";

export const metadata = {
  title: "Mixtapes — Mixtape",
};

// Placeholder data — replace with `await prisma.mixtape.findMany(...)` once seeded.
const sampleMixtapes = [
  {
    id: "1",
    title: "Sunday Morning Slow",
    author: "marcus",
    description: "Coffee on, blinds half-open, nothing urgent.",
    trackCount: 12,
  },
  {
    id: "2",
    title: "Walk Home at 2am",
    author: "friend",
    description: "Empty streets, headphones loud, the city humming.",
    trackCount: 18,
  },
  {
    id: "3",
    title: "Kitchen Disco",
    author: "marcus",
    description: "Pasta water boiling, someone laughing too loud.",
    trackCount: 9,
  },
];

export default function MixtapesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Mixtapes</h1>
          <p className="mt-2 text-[color:var(--color-muted)] max-w-xl">
            Playlists with personality. Sequencing matters. Liner notes encouraged.
          </p>
        </div>
        <Link
          href="/mixtapes/new"
          className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
        >
          New mixtape
        </Link>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sampleMixtapes.map((m) => (
          <li
            key={m.id}
            className="group rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 hover:border-pink-400/40 transition-colors"
          >
            <div className="aspect-square rounded-xl mb-4 bg-gradient-to-br from-pink-400/40 via-fuchsia-400/30 to-indigo-400/40" />
            <h2 className="text-lg font-semibold">{m.title}</h2>
            <p className="text-sm text-[color:var(--color-muted)] mt-1">by {m.author}</p>
            <p className="text-sm mt-3 text-[color:var(--color-muted)] line-clamp-2">
              {m.description}
            </p>
            <p className="mt-4 text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
              {m.trackCount} tracks
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
