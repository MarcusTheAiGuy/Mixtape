import type { TasteEntry, TasteCategory } from "@/lib/taste";
import { CATEGORY_META, ORDERED_CATEGORIES } from "@/lib/taste";
import { computeInsights, type Insights } from "@/lib/insights";

export function TasteInsights({ entries }: { entries: TasteEntry[] }) {
  const insights = computeInsights(entries);

  if (insights.totalFilled === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CompletenessCard insights={insights} />
      <VibeCard insights={insights} />
      <CrossoversCard insights={insights} />
    </section>
  );
}

function CompletenessCard({ insights }: { insights: Insights }) {
  const pct = Math.round(insights.completion * 100);
  return (
    <article className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-4">
        Profile completeness
      </h3>
      <div className="flex items-center gap-5">
        <Ring value={insights.completion} />
        <div>
          <p className="text-3xl font-semibold tabular-nums">
            {insights.totalFilled}
            <span className="text-[color:var(--color-muted)] text-xl">/{insights.totalSlots}</span>
          </p>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{pct}% filled in</p>
        </div>
      </div>
      <ul className="mt-5 space-y-1.5">
        {ORDERED_CATEGORIES.map((cat) => (
          <li key={cat} className="flex items-center gap-3 text-sm">
            <span className="flex-1 text-[color:var(--color-muted)]">
              {CATEGORY_META[cat].label.replace("Top 5 ", "")}
            </span>
            <CategoryDots filled={insights.perCategory[cat as TasteCategory]} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function VibeCard({ insights }: { insights: Insights }) {
  return (
    <article className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-4">
        Your vibe
      </h3>
      {insights.vibe ? (
        <p className="text-2xl md:text-3xl font-semibold leading-tight">
          {insights.vibe}.
        </p>
      ) : (
        <p className="text-[color:var(--color-muted)]">
          Add a few genres to surface a vibe.
        </p>
      )}
      {insights.topGenres.length > 0 && (
        <ul className="mt-5 space-y-2">
          {insights.topGenres.map((g) => (
            <li key={g.name} className="flex items-center gap-3">
              <span className="text-sm w-32 truncate">{g.name}</span>
              <span className="flex-1 h-1.5 rounded-full bg-[color:var(--color-border)] overflow-hidden">
                <span
                  className="block h-full bg-gradient-to-r from-pink-400 to-indigo-400"
                  style={{ width: `${(g.weight / 5) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function CrossoversCard({ insights }: { insights: Insights }) {
  return (
    <article className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-4">
        Recurring names
      </h3>
      {insights.crossovers.length === 0 ? (
        <p className="text-[color:var(--color-muted)]">
          Names that show up across categories will appear here — like an artist
          you put in your top 5 who also has a top album in your list.
        </p>
      ) : (
        <ul className="space-y-3">
          {insights.crossovers.map((c) => (
            <li key={c.name}>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-[color:var(--color-muted)] mt-0.5">
                appears in{" "}
                {c.appearances
                  .map((a) => CATEGORY_META[a.category].label.replace("Top 5 ", ""))
                  .join(" + ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Ring({ value }: { value: number }) {
  // Tailwind v4-friendly SVG ring. value 0..1.
  const size = 84;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, value)));

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#mixtape-ring)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <defs>
        <linearGradient id="mixtape-ring" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CategoryDots({ filled }: { filled: number }) {
  return (
    <span className="flex gap-1" aria-label={`${filled} of 5 filled`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < filled
              ? "bg-gradient-to-br from-pink-400 to-indigo-400"
              : "bg-[color:var(--color-border)]"
          }`}
        />
      ))}
    </span>
  );
}
