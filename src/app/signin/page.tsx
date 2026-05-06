export const metadata = { title: "Sign in — Edinburgh Foyer" };

export default function SignInPage() {
  const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight mb-3">Welcome back</h1>
      <p className="text-[color:var(--color-muted)] mb-10">
        Sign in to share mixtapes and RSVP to meetups.
      </p>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-6">
        {googleConfigured ? (
          <form action="/api/auth/signin/google" method="POST">
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Continue with Google
            </button>
          </form>
        ) : (
          <p className="text-sm text-[color:var(--color-muted)]">
            Auth providers not configured yet. Add{" "}
            <code className="text-pink-300">AUTH_GOOGLE_ID</code> and{" "}
            <code className="text-pink-300">AUTH_GOOGLE_SECRET</code> to your{" "}
            <code>.env</code> to enable Google sign-in.
          </p>
        )}
      </div>
    </div>
  );
}
