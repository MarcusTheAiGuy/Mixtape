"use client";

import { useEffect, useRef } from "react";

/**
 * Wires up the standard modal accessibility behaviour:
 *
 * - **Focus trap**: Tab/Shift+Tab cycles within the modal while it's open
 * - **Escape**: closes the modal
 * - **Body scroll lock**: prevents the page underneath from scrolling
 * - **Focus restore**: returns focus to the trigger element on close
 *
 * Returns a ref to attach to the modal's root element.
 *
 * Usage:
 *   const ref = useModalA11y(open, () => setOpen(false));
 *   return open ? <div ref={ref} role="dialog" aria-modal>...</div> : null;
 */
export function useModalA11y(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;

    // Remember what had focus before so we can return it on close.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Lock body scroll while open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first focusable inside the modal (or the modal itself).
    const focusable = focusableWithin(node);
    (focusable[0] ?? node).focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusableWithin(node!);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey) {
        if (active === first || !node!.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return ref;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null,
  );
}
