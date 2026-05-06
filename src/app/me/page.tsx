import { TasteEditor } from "@/components/TasteEditor";

export const metadata = {
  title: "Your taste — Mixtape",
};

export default function MePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Your taste</h1>
        <p className="mt-3 text-[color:var(--color-muted)] max-w-xl leading-relaxed">
          Drop in whatever comes to mind — albums, artists, the gigs you still talk about.
          Don&apos;t worry about getting the &quot;right&quot; answer. Anything you fill in helps
          us match you with the right people.
        </p>
      </header>

      <TasteEditor />
    </div>
  );
}
