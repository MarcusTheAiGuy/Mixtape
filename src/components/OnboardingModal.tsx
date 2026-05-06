"use client";

import { useEffect, useState } from "react";
import { useModalA11y } from "@/lib/use-modal-a11y";

const ONBOARDING_KEY = "mixtape:onboarded";

const STEPS = [
  {
    title: "Hi. Welcome to Mixtape.",
    body:
      "Drop your favourite albums, artists, genres, songs, and the gigs that stuck with you. Half-filled is fine.",
  },
  {
    title: "Two layers of taste.",
    body:
      "Your top 5s are the all-time identity layer. Each month we'll prompt you for a mood snapshot — lighter, what's on rotation now.",
  },
  {
    title: "Find your people.",
    body:
      "Once you've got a few picks down, Discover ranks others by how much your taste lines up. Meetups get a fit score too.",
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!window.localStorage.getItem(ONBOARDING_KEY)) {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(ONBOARDING_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
  }

  function next() {
    if (step + 1 >= STEPS.length) dismiss();
    else setStep(step + 1);
  }

  const dialogRef = useModalA11y(open, dismiss);

  if (!open) return null;
  const current = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={dismiss}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        tabIndex={-1}
        className="relative bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl p-7 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1.5 mb-5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step
                  ? "bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)]"
                  : "bg-[color:var(--color-border)]"
              }`}
            />
          ))}
        </div>

        <h2 id="onboarding-title" className="text-2xl font-semibold tracking-tight mb-3">
          {current.title}
        </h2>
        <p className="text-[color:var(--color-muted)] leading-relaxed">{current.body}</p>

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={dismiss}
            className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={next}
            className="px-4 py-2 rounded-full bg-[color:var(--color-foreground)] text-[color:var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {step + 1 === STEPS.length ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
