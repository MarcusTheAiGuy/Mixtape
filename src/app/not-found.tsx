import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-3">
        404
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
        That page is between songs.
      </h1>
      <p className="text-[color:var(--color-muted)] leading-relaxed mb-8">
        We couldn&apos;t find what you were looking for.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-[color:var(--color-foreground)] text-[color:var(--color-background)] hover:opacity-90 transition-opacity"
        >
          Home
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm border border-[color:var(--color-border)] hover:bg-white/5 transition-colors"
        >
          Discover people
        </Link>
        <Link
          href="/meetups"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm border border-[color:var(--color-border)] hover:bg-white/5 transition-colors"
        >
          Browse meetups
        </Link>
      </div>
    </div>
  );
}
