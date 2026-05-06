export type Profile = {
  displayName: string;
  username: string;
  bio: string;
  location: string;
  // Cropped avatar stored as a data URL while we don't have blob storage.
  // Once we wire up Vercel Blob (or similar), swap to a remote URL.
  avatarDataUrl: string | null;
  // Accent color used to theme the user's profile pages. One of
  // ACCENT_PRESETS or a custom hex. Falls back to the default gradient.
  accentHex?: string | null;
};

export const DEFAULT_PROFILE: Profile = {
  displayName: "",
  username: "",
  bio: "",
  location: "",
  avatarDataUrl: null,
  accentHex: null,
};

export const PROFILE_STORAGE_KEY = "mixtape:profile";

/**
 * Length limits used by both client UI (maxLength + slice) and server
 * actions (validation). Pick once, enforce in both places.
 */
export const PROFILE_LIMITS = {
  displayName: 60,
  username: 20,
  location: 80,
  bio: 240,
} as const;

const USERNAME_RE = /^[a-z0-9_]+$/;

/**
 * Strip everything except `[a-z0-9_]` from a username and clamp the length.
 * Used as we type so the UI value never holds an invalid character.
 */
export function sanitizeUsername(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, PROFILE_LIMITS.username);
}

/** Same rules in a server-context-safe boolean form. */
export function isValidUsername(value: string): boolean {
  if (!value) return true; // optional field
  if (value.length > PROFILE_LIMITS.username) return false;
  return USERNAME_RE.test(value);
}

// Curated palette — readable on both light + dark backgrounds.
export const ACCENT_PRESETS: { name: string; hex: string }[] = [
  { name: "Pink", hex: "#f472b6" },
  { name: "Rose", hex: "#fb7185" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Lime", hex: "#84cc16" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Teal", hex: "#06b6d4" },
  { name: "Indigo", hex: "#818cf8" },
  { name: "Violet", hex: "#a855f7" },
  { name: "Red", hex: "#ef4444" },
];

const ACCENT_HEX_RE = /^#[0-9a-fA-F]{6}$/;

/**
 * Whitelist accent values. We accept any 6-char hex (since the picker is
 * pinned to the preset list anyway, this is just defence-in-depth for when
 * the same field is written by a server action from form data).
 */
export function isValidAccent(value: string | null | undefined): boolean {
  if (value == null) return true;
  return ACCENT_HEX_RE.test(value);
}
