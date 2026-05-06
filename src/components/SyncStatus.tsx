"use client";

import { useEffect, useState } from "react";

type Mode = "loading" | "remote" | "local";

/**
 * Probes /api/me/whoami once to determine whether we should be calling
 * server actions (signed-in + DB available) or falling back to localStorage.
 * Renders a small inline pill so users always know which mode they're in.
 */
export function SyncStatus() {
  const [mode, setMode] = useState<Mode>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me/whoami", { cache: "no-store" });
        const data = (await res.json()) as { authenticated: boolean; hasDb: boolean };
        if (!cancelled) {
          setMode(data.authenticated && data.hasDb ? "remote" : "local");
        }
      } catch {
        if (!cancelled) setMode("local");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (mode === "loading") return null;

  const isRemote = mode === "remote";
  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs ${
        isRemote
          ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
          : "bg-amber-400/10 text-amber-300 border border-amber-400/30"
      }`}
      title={
        isRemote
          ? "Signed in. Changes save to your account."
          : "Demo mode. Changes save in this browser only."
      }
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isRemote ? "bg-emerald-300" : "bg-amber-300"
        }`}
      />
      {isRemote ? "saving to your account" : "saving locally"}
    </span>
  );
}
