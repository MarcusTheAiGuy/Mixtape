"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 border-b border-[color:var(--color-border)]">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-muted)] mb-8"
      >
        Edinburgh — Music · Film · Art
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-6xl md:text-8xl lg:text-9xl uppercase font-bold leading-[0.95] tracking-tight max-w-5xl"
      >
        Love the show.
        <br />
        <span className="bg-gradient-to-r from-[#c23b2a] via-[#d4a827] to-[#c23b2a] bg-clip-text text-transparent">
          Meet the people.
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <Link
          href="/me"
          className="px-8 py-4 bg-[color:var(--color-foreground)] text-[color:var(--color-background)] font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
        >
          Tell us your taste
        </Link>
        <Link
          href="/meetups"
          className="px-8 py-4 border border-[color:var(--color-foreground)] font-bold uppercase tracking-widest text-sm hover:bg-[color:var(--color-foreground)] hover:text-[color:var(--color-background)] transition-colors"
        >
          See upcoming events
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        className="mt-10 max-w-lg text-base text-[color:var(--color-muted)] leading-relaxed border-l-2 border-[color:var(--color-accent)] pl-4"
      >
        You&apos;ve been to a gig at Usher Hall, a screening at The Cameo or The Filmhouse —
        surrounded by people who love the same art you do. Then you all leave and never
        see each other again. Edinburgh Foyer fixes that.
      </motion.p>
    </section>
  );
}
