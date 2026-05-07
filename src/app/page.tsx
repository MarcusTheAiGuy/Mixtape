import Link from "next/link";
import { Hero } from "@/components/Hero";

const features = [
  {
    title: "Share what you love",
    body: "Music, film, art — tell us your favourites. A gig you still talk about, a film that wrecked you, an artist you can't stop recommending.",
    href: "/me",
    cta: "Build your profile",
  },
  {
    title: "Get matched",
    body: "We pair you with people in Edinburgh who love the same things. The more you share, the better the match.",
    href: "/discover",
    cta: "See your matches",
  },
  {
    title: "Show up",
    body: "Pub nights in Edinburgh where the people you're matched with are actually there. No awkward cold starts — you already have something in common.",
    href: "/meetups",
    cta: "Find an event",
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
            className="group relative overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 p-8 hover:border-[#c23b2a]/60 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#c23b2a]/0 via-transparent to-[#d4a827]/0 group-hover:from-[#c23b2a]/8 group-hover:to-[#d4a827]/8 transition-colors" />
            <h3 className="relative text-xl font-bold uppercase tracking-wide mb-3">{f.title}</h3>
            <p className="relative text-[color:var(--color-muted)] leading-relaxed mb-6">
              {f.body}
            </p>
            <span className="relative inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#c23b2a] group-hover:text-[#d4a827] transition-colors">
              {f.cta}
              <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
