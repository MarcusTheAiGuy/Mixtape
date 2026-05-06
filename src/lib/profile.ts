export type Profile = {
  displayName: string;
  username: string;
  bio: string;
  location: string;
  // Cropped avatar stored as a data URL while we don't have blob storage.
  // Once we wire up Vercel Blob (or similar), swap to a remote URL.
  avatarDataUrl: string | null;
};

export const DEFAULT_PROFILE: Profile = {
  displayName: "",
  username: "",
  bio: "",
  location: "",
  avatarDataUrl: null,
};

export const PROFILE_STORAGE_KEY = "mixtape:profile";
