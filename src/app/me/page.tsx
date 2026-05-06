import { MeProfileEditor } from "@/components/MeProfileEditor";

export const metadata = {
  title: "Your profile — Mixtape",
};

export default function MePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Your profile</h1>
        <p className="mt-3 text-[color:var(--color-muted)] max-w-xl leading-relaxed">
          A photo, a couple of words about you, and your top 5s. Anything goes —
          you can leave slots empty, and you can change everything later.
        </p>
      </header>

      <MeProfileEditor />
    </div>
  );
}
