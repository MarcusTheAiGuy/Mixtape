export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div>
        <div className="h-12 w-56 rounded-lg bg-[color:var(--color-card)]/40 animate-pulse" />
        <div className="mt-3 h-4 w-2/3 rounded bg-[color:var(--color-card)]/40 animate-pulse" />
      </div>
      <div className="h-40 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />
      <div className="space-y-4">
        <div className="h-32 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />
        <div className="h-32 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />
        <div className="h-32 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse" />
      </div>
    </div>
  );
}
