import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { themeInitScript } from "@/components/ThemeToggle";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Edinburgh Foyer — meet the people who were there",
  description:
    "You've been to the gig, the screening, the show — surrounded by people who love the same things. Edinburgh Foyer matches you with them at a pub night.",
  metadataBase: new URL("https://mixtape.app"),
  openGraph: {
    title: "Edinburgh Foyer",
    description: "Love the show. Meet the people.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <SkipLink />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
