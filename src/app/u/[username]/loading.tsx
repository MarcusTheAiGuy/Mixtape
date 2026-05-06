export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-start gap-6 mb-12">
        <div className="w-28 h-28 rounded-full bg-[color:var(--color-card)]/40 animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-48 rounded-lg bg-[color:var(--color-card)]/40 animate-pulse" />
          <div className="h-4 w-32 rounded bg-[color:var(--color-card)]/40 animate-pulse" />
        </div>
      </div>
      <div className="h-40 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse mb-8" />
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
