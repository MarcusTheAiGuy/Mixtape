import { WishlistEditor } from "@/components/WishlistEditor";

export const metadata = {
  title: "Wishlist — Edinburgh Foyer",
};

export default function WishlistPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Wishlist</h1>
        <p className="mt-3 text-[color:var(--color-muted)] max-w-xl leading-relaxed">
          Shows you want to go to. Other people can see your wishlist and ask to tag along —
          a low-stakes way to find a +1.
        </p>
      </header>

      <WishlistEditor />
    </div>
  );
}
