export type Profile = {
  displayName: string;
  username: string;
  bio: string;
  location: string;
  // Cropped avatar stored as a data URL while we don't have blob storage.
  // Once we wire up Vercel Blob (or similar), swap to a remote URL.
  avatarDataUrl: string | null;
  // Accent color used to theme the user's profile pages. One of ACCENT_PRESETS
  // or a custom hex. Falls back to the default pink/indigo gradient.
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
