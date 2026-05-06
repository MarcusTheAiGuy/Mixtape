"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "mixtape:theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return "dark"; // default
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read theme from localStorage after mount to keep SSR output stable.
    const initial = readTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore quota errors
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="w-9 h-9 rounded-full border border-[color:var(--color-border)] flex items-center justify-center hover:bg-white/5 transition-colors"
      suppressHydrationWarning
    >
      <span aria-hidden className="text-base">
        {mounted ? (theme === "dark" ? "☾" : "☀") : "☾"}
      </span>
    </button>
  );
}

// Inline script that runs before hydration to avoid a flash of the wrong theme.
export const themeInitScript = `
(function(){try{
  var s=localStorage.getItem('${STORAGE_KEY}');
  var t=(s==='light')?'light':'dark';
  if(t==='dark'){document.documentElement.classList.add('dark');}
}catch(e){document.documentElement.classList.add('dark');}})();
`;
