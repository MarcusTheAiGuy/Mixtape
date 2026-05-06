import type { HTMLAttributes, ReactNode } from "react";

type Tone = "muted" | "accent" | "outline";

const TONES: Record<Tone, string> = {
  muted:
    "bg-[color:var(--color-card)] text-[color:var(--color-muted)] border border-[color:var(--color-border)]",
  accent:
    "bg-[color:var(--color-accent)]/15 text-[color:var(--color-foreground)] border border-[color:var(--color-accent)]/40",
  outline:
    "border border-[color:var(--color-border)] text-[color:var(--color-muted)]",
};

export type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  children: ReactNode;
};

/**
 * Small pill used for taste filter tags, in-common items, fit-score badges
 * and similar.
 */
export function Chip({
  tone = "outline",
  className = "",
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      {...rest}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
