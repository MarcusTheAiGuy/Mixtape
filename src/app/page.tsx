import Link from "next/link";
import { Hero } from "@/components/Hero";

const features = [
  {
    title: "Your top 5s",
    body: "Albums, artists, genres, songs, gigs. Anything goes — half-filled is fine. The more we know, the better the matches.",
    href: "/me",
    cta: "Start your profile",
  },
  {
    title: "Wishlist next",
    body: "Save the shows you want to make it to. Other people see your wishlist and can ask to tag along.",
    href: "/wishlist",
    cta: "Add a show",
  },
  {
    title: "Meet up",
    body: "Listening parties, record swaps, gigs. Each meetup is tagged with the taste it's for, so you only see what fits.",
    href: "/meetups",
    cta: "See what's on",
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
            className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 p-6 hover:border-[#6b9e6e]/60 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6b9e6e]/0 via-transparent to-[#c4703a]/0 group-hover:from-[#6b9e6e]/8 group-hover:to-[#c4703a]/8 transition-colors" />
            <h3 className="relative text-xl font-normal mb-2">{f.title}</h3>
            <p className="relative text-[color:var(--color-muted)] leading-relaxed mb-6">
              {f.body}
            </p>
            <span className="relative inline-flex items-center text-sm text-[#6b9e6e] group-hover:text-[#c4703a] transition-colors">
              {f.cta}
              <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
