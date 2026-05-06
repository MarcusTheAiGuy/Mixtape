// Inline progress + empty-state nudges that adapt to how much the viewer has
// filled in. All client-side because they read localStorage.

const TOTAL_SLOTS = 25;

export function ProgressNudge({ filled }: { filled: number }) {
  if (filled === 0) {
    return (
      <Nudge tone="prompt">
        Pick one album above to start. The list builds itself from there.
      </Nudge>
    );
  }
  if (filled < 5) {
    const left = Math.max(1, 5 - filled);
    return (
      <Nudge tone="progress">
        {left} more pick{left === 1 ? "" : "s"} until your taste has enough to
        start matching you with people in Discover.
      </Nudge>
    );
  }
  if (filled < 12) {
    return (
      <Nudge tone="progress">
        Looking good. Filling in genres and artists especially helps the match
        score get a sharper read.
      </Nudge>
    );
  }
  if (filled < TOTAL_SLOTS) {
    return (
      <Nudge tone="celebrate">
        You&apos;re {TOTAL_SLOTS - filled} slot{TOTAL_SLOTS - filled === 1 ? "" : "s"} away from
        a full profile.
      </Nudge>
    );
  }
  return (
    <Nudge tone="celebrate">
      Profile&apos;s full. Pop into Discover to see who matches.
    </Nudge>
  );
}

function Nudge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "prompt" | "progress" | "celebrate";
}) {
  const styles = {
    prompt: "border-[color:var(--color-border)] bg-[color:var(--color-card)]/40",
    progress: "border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/5",
    celebrate: "border-[color:var(--color-accent-2)]/40 bg-[color:var(--color-accent-2)]/10",
  } as const;
  return (
    <div className={`mt-6 rounded-xl border p-4 text-sm ${styles[tone]}`}>{children}</div>
  );
}
