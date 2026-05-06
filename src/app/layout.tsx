import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mixtape — share music, find your people",
  description:
    "Mixtape is where friends swap playlists and gather IRL. Share what you're listening to, host a meetup, hear something new.",
  metadataBase: new URL("https://mixtape.app"),
  openGraph: {
    title: "Mixtape",
    description: "Share music. Meet up. Repeat.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
