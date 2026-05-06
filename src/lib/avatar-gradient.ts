/**
 * Deterministic gradient palette for the empty-avatar state.
 *
 * Without this, every user without an uploaded photo gets the same default
 * pink→indigo gradient. Hashing the username (or display name) into a
 * stable pair from the palette gives every person their own colour without
 * any state.
 */

const GRADIENTS: [string, string][] = [
  ["#f472b6", "#a855f7"], // pink → violet
  ["#fb7185", "#f59e0b"], // rose → amber
  ["#84cc16", "#06b6d4"], // lime → teal
  ["#10b981", "#3b82f6"], // emerald → blue
  ["#06b6d4", "#818cf8"], // teal → indigo
  ["#a855f7", "#3b82f6"], // violet → blue
  ["#ef4444", "#f59e0b"], // red → amber
  ["#f59e0b", "#ec4899"], // amber → pink
  ["#22d3ee", "#a855f7"], // cyan → violet
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Returns `[from, to]` hex pair for the given seed. Stable. */
export function gradientFor(seed: string | null | undefined): [string, string] {
  const k = (seed ?? "").trim().toLowerCase();
  if (!k) return GRADIENTS[0];
  return GRADIENTS[hash(k) % GRADIENTS.length];
}

/** A ready-to-use linear-gradient CSS value. */
export function gradientCss(seed: string | null | undefined): string {
  const [from, to] = gradientFor(seed);
  return `linear-gradient(135deg, ${from}, ${to})`;
}
