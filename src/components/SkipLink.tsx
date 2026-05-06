/**
 * Hidden-by-default link that becomes the first focusable element when a
 * keyboard user tabs into the page. Lets them skip Navbar links and jump
 * straight to main content. Tailwind's `sr-only` + `focus:not-sr-only`
 * pattern.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[color:var(--color-foreground)] focus:text-[color:var(--color-background)] focus:font-medium focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
    >
      Skip to main content
    </a>
  );
}
