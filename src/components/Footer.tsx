export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[color:var(--color-muted)]">
        <p>© {new Date().getFullYear()} Edinburgh Mixtape</p>
        <p>Made in Edinburgh.</p>
      </div>
    </footer>
  );
}
