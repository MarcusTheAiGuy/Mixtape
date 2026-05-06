import type { CSSProperties, ReactNode } from "react";

// Wraps a profile region with the user's chosen accent color, applied via CSS
// custom properties so all `[color:var(--color-accent)]` references inherit.
// Server-renderable.
export function ProfileTheme({
  accentHex,
  children,
}: {
  accentHex?: string | null;
  children: ReactNode;
}) {
  if (!accentHex) return <>{children}</>;
  const style: CSSProperties & Record<string, string> = {
    "--color-accent": accentHex,
  };
  return <div style={style}>{children}</div>;
}
