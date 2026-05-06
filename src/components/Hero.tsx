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
        Share music.{" "}
        <span className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
          Meet up.
        </span>{" "}
        Repeat.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="mt-6 max-w-xl text-lg text-[color:var(--color-muted)] leading-relaxed"
      >
        Mixtape is the place to swap playlists with friends, surface what you&apos;re into,
        and gather around the music you love — online and in real life.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mt-10 flex flex-wrap gap-3"
      >
        <Link
          href="/signin"
          className="px-5 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          Get started
        </Link>
        <Link
          href="/mixtapes"
          className="px-5 py-3 rounded-full border border-white/15 hover:bg-white/5 transition-colors"
        >
          Browse mixtapes
        </Link>
      </motion.div>
    </section>
  );
}
