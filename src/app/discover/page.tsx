import { DiscoverList } from "@/components/DiscoverList";
import { listDiscoverableUsers } from "@/lib/data/users";

export const metadata = {
  title: "Discover — Edinburgh Foyer",
};

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const users = await listDiscoverableUsers();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Discover</h1>
        <p className="mt-3 text-[color:var(--color-muted)] max-w-xl leading-relaxed">
          People sorted by how much your taste lines up. Match scores update as
          you fill in more of your top 5s.
        </p>
      </header>
      <DiscoverList users={users} />
    </div>
  );
}
