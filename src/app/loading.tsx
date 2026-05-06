/**
 * Default app-wide loading skeleton — used by the App Router whenever a
 * route segment hasn't shipped its own `loading.tsx`. Keep it featherweight;
 * a heavy skeleton is worse than a quiet blank.
 */
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
      <div className="h-10 w-48 rounded-lg bg-[color:var(--color-card)]/40 animate-pulse" />
      <div className="h-4 w-2/3 rounded bg-[color:var(--color-card)]/40 animate-pulse" />
      <div className="grid gap-3 mt-10">
        <div className="h-24 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />
        <div className="h-24 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />
        <div className="h-24 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />
      </div>
    </div>
  );
}
