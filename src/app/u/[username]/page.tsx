import { notFound } from "next/navigation";
import { ORDERED_CATEGORIES, CATEGORY_META, type TasteEntry } from "@/lib/taste";

export const metadata = {
  title: "Profile — Mixtape",
};

// Sample data for development. Once Prisma + Auth are wired up, replace this
// with: `await prisma.user.findUnique({ where: { username }, include: { taste: true } })`.
const SAMPLE_PROFILES: Record<
  string,
  { name: string; username: string; bio: string; location: string; taste: TasteEntry[] }
> = {
  marcus: {
    name: "Marcus",
    username: "marcus",
    bio: "Always chasing the next gig. Big into shoegaze right now.",
    location: "London",
    taste: [
      { category: "ALBUM", position: 1, name: "Loveless", subtitle: "My Bloody Valentine" },
      { category: "ALBUM", position: 2, name: "In Rainbows", subtitle: "Radiohead" },
      { category: "ARTIST", position: 1, name: "Big Thief", subtitle: null },
      { category: "ARTIST", position: 2, name: "Caroline Polachek", subtitle: null },
      { category: "GENRE", position: 1, name: "Shoegaze" },
      { category: "GENRE", position: 2, name: "Indie folk" },
      { category: "SONG", position: 1, name: "Not", subtitle: "Big Thief" },
      { category: "LIVE_SHOW", position: 1, name: "Big Thief", subtitle: "Roundhouse, 2023" },
    ],
  },
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = SAMPLE_PROFILES[username.toLowerCase()];
  if (!profile) notFound();

  const grouped = new Map<string, TasteEntry[]>();
  for (const cat of ORDERED_CATEGORIES) grouped.set(cat, []);
  for (const e of profile.taste) {
    grouped.get(e.category)?.push(e);
  }
  for (const list of grouped.values()) list.sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="flex items-center gap-5 mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400/60 to-indigo-400/60 flex items-center justify-center text-3xl font-semibold">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-[color:var(--color-muted)] text-sm mt-1">
            @{profile.username} · {profile.location}
          </p>
        </div>
      </header>

      <p className="text-lg leading-relaxed mb-12">{profile.bio}</p>

      <div className="space-y-8">
        {ORDERED_CATEGORIES.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="text-sm uppercase tracking-wider text-[color:var(--color-muted)] mb-4">
                {CATEGORY_META[cat].label}
              </h2>
              <ol className="space-y-2">
                {items.map((e) => (
                  <li
                    key={`${e.category}-${e.position}`}
                    className="flex items-center gap-4 p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-full border border-[color:var(--color-border)] flex items-center justify-center text-xs text-[color:var(--color-muted)]">
                      {e.position}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{e.name}</p>
                      {e.subtitle && (
                        <p className="text-sm text-[color:var(--color-muted)] truncate">
                          {cat === "SONG" || cat === "ALBUM"
                            ? `By ${e.subtitle}`
                            : e.subtitle}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
