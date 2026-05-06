import type { HTMLAttributes, ReactNode } from "react";

type Tone = "solid" | "soft" | "dashed";

const TONES: Record<Tone, string> = {
  solid: "border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60",
  soft: "border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40",
  dashed: "border border-dashed border-[color:var(--color-border)]",
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: Tone;
  /** Pads `p-5` by default. Set to `false` to drop padding. */
  padded?: boolean;
  children: ReactNode;
};

/**
 * The standard rounded card surface used across the app — meetup cards,
 * insight panels, profile editor sections, etc. Use the `tone` prop to switch
 * between full-card, soft, and dashed empty-state variants.
 */
export function Card({
  tone = "solid",
  padded = true,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={`rounded-2xl ${TONES[tone]} ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
