"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-5xl md:text-7xl tracking-tight font-semibold leading-[1.05] max-w-3xl"
      >
        Share your taste.{" "}
        <span className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
          Find your people.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="mt-6 max-w-xl text-lg text-[color:var(--color-muted)] leading-relaxed"
      >
        Drop your top 5 albums, artists, genres, songs, and the gigs you still
        talk about. We&apos;ll match you with people who get it — and the meetups
        worth showing up for.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mt-10 flex flex-wrap gap-3"
      >
        <Link
          href="/me"
          className="px-5 py-3 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] font-medium hover:opacity-90 transition-opacity"
        >
          Build your top 5s
        </Link>
        <Link
          href="/meetups"
          className="px-5 py-3 rounded-full border border-[color:var(--color-border)] hover:bg-white/5 transition-colors"
        >
          Browse meetups
        </Link>
      </motion.div>
    </section>
  );
}
