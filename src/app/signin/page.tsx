import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const metadata = { title: "Sign in — Edinburgh Foyer" };

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/me");

  const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight mb-3">Welcome back</h1>
      <p className="text-[color:var(--color-muted)] mb-10">
        Sign in to share mixtapes and RSVP to meetups.
      </p>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-6">
        {googleConfigured ? (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/me" });
            }}
          >
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-3"
            >
              <GoogleMark />
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

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#EA4335" d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" />
      <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#FBBC05" d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" />
    </svg>
  );
}
