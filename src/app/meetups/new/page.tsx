import Link from "next/link";
import { NewMeetupForm } from "@/components/NewMeetupForm";

export const metadata = {
  title: "Host a meetup — Mixtape",
};

export default function NewMeetupPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/meetups"
        className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
      >
        ← All meetups
      </Link>
      <header className="mt-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Host a meetup</h1>
        <p className="mt-3 text-[color:var(--color-muted)] max-w-xl leading-relaxed">
          Listening party in your living room, record swap at the cafe round
          the corner, +1 to a gig. Tag it with the taste it&apos;s for so the
          right people find it.
        </p>
      </header>

      <NewMeetupForm />
    </div>
  );
}
