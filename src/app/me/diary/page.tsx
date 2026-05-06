import Link from "next/link";
import { MoodTimeline } from "@/components/MoodTimeline";

export const metadata = {
  title: "Mood diary — Mixtape",
};

export default function DiaryPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/me"
            className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
          >
            ← Back to your taste
          </Link>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">Mood diary</h1>
          <p className="mt-3 text-[color:var(--color-muted)] max-w-xl leading-relaxed">
            A scrollable record of what you were into, month by month. Lighter
            and looser than your identity top 5s — just whatever&apos;s on rotation.
          </p>
        </div>
      </header>

      <MoodTimeline />
    </div>
  );
}
