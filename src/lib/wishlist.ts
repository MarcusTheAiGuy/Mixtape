export type WishlistShow = {
  id: string;
  artist: string;
  artistMbid?: string | null;
  tourName?: string | null;
  venue?: string | null;
  city?: string | null;
  date?: string | null; // ISO yyyy-mm-dd
  url?: string | null;
  notes?: string | null;
};

export function newWishlistId(): string {
  return `w_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}
