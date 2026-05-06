import type { HTMLAttributes, ReactNode } from "react";

export type SectionLabelProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

/**
 * The small uppercase eyebrow header used above sections of the showcase
 * + insight cards. Centralised so spacing/letter-spacing stay consistent.
 */
export function SectionLabel({
  className = "",
  children,
  ...rest
}: SectionLabelProps) {
  return (
    <p
      {...rest}
      className={`text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)] ${className}`}
    >
      {children}
    </p>
  );
}
