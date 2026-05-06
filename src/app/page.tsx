import Link from "next/link";
import { Hero } from "@/components/Hero";

const features = [
  {
    title: "Make a mixtape",
    body: "Curate a playlist, write the liner notes, share it with the people who'll get it.",
    href: "/mixtapes",
    cta: "Browse mixtapes",
  },
  {
    title: "Find a meetup",
    body: "Listening parties, record swaps, gigs at the back of a bar. Show up. Hear something new.",
    href: "/meetups",
    cta: "See what's on",
  },
  {
    title: "Bring your friends",
    body: "Mixtape is better with the right people. Invite a friend, build a scene.",
    href: "/signin",
    cta: "Get started",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="max-w-6xl mx-auto px-6 py-20 grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-6 hover:border-pink-400/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/0 via-transparent to-indigo-400/0 group-hover:from-pink-400/10 group-hover:to-indigo-400/10 transition-colors" />
            <h3 className="relative text-xl font-semibold mb-2">{f.title}</h3>
            <p className="relative text-[color:var(--color-muted)] leading-relaxed mb-6">
              {f.body}
            </p>
            <span className="relative inline-flex items-center text-sm text-pink-300 group-hover:text-pink-200">
              {f.cta} <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
