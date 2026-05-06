import Link from "next/link";

const navLinks = [
  { href: "/mixtapes", label: "Mixtapes" },
  { href: "/meetups", label: "Meetups" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--color-background)]/60 border-b border-[color:var(--color-border)]">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-pink-400 to-indigo-400 shadow-[0_0_24px_rgba(244,114,182,0.5)] group-hover:scale-105 transition-transform" />
          <span className="text-lg tracking-tight font-semibold">Mixtape</span>
        </Link>

        <ul className="flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-3 py-2 rounded-md text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/signin"
              className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/15 transition-colors"
            >
              Sign in
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
