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
        className="text-5xl md:text-7xl tracking-tight font-normal leading-[1.08] max-w-3xl"
      >
        Love the show.{" "}
        <span className="bg-gradient-to-r from-[#c23b2a] via-[#d4a827] to-[#c23b2a] bg-clip-text text-transparent">
          Meet the people.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="mt-6 max-w-xl text-lg text-[color:var(--color-muted)] leading-relaxed"
      >
        You&apos;ve been to a gig at Usher Hall, a screening at The Cameo or The Filmhouse —
        surrounded by people who love the same art you do. Then you all leave and never
        see each other again. Edinburgh Foyer fixes that. Tell us what you love and
        we&apos;ll match you with your people at a pub night.
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
          Tell us your taste
        </Link>
        <Link
          href="/meetups"
          className="px-5 py-3 rounded-full border border-[color:var(--color-border)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          See upcoming events
        </Link>
      </motion.div>
    </section>
  );
}
