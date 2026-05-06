export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="h-12 w-48 rounded-lg bg-[color:var(--color-card)]/40 animate-pulse mb-3" />
      <div className="h-4 w-2/3 rounded bg-[color:var(--color-card)]/40 animate-pulse mb-10" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-[color:var(--color-card)]/30 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
