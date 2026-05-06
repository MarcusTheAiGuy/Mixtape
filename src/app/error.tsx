"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * App-wide error boundary. Logs the error in dev, shows a friendly fallback
 * with a retry. Per-route segments can override with their own error.tsx.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[mixtape error]", error);
    }
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-3">
        Something glitched
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
        That didn&apos;t play.
      </h1>
      <p className="text-[color:var(--color-muted)] leading-relaxed mb-8">
        Hit retry, or head back home. If it keeps happening, the issue is
        probably on our end.
      </p>
      <div className="flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm border border-[color:var(--color-border)] hover:bg-white/5 transition-colors"
        >
          Home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-[color:var(--color-muted)]">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
