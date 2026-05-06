import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-foreground)] text-[color:var(--color-background)] hover:opacity-90",
  secondary:
    "border border-[color:var(--color-border)] hover:bg-white/5",
  ghost:
    "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

const BASE =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
};

/**
 * Pill button used everywhere in the app.
 *
 * @example
 *   <Button variant="primary" onClick={save}>Save</Button>
 */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/**
 * Same shape as `Button` but renders a Next.js `<Link>` — for navigation that
 * looks like a CTA.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
