import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://crdeckbuilder.top"),
  title: {
    default: "CR Deck Builder - Best Clash Royale Decks for Every Arena",
    template: "%s | CR Deck Builder",
  },
  description:
    "Find the best Clash Royale decks for every arena. Deck recommendations with win rates and usage stats. Updated for the current meta.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "3IzPFvO7upt5gdBGlXOi0vdImSmTFwFjXRh5CyalHWU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <nav className="border-b border-gray-800 px-4 py-3">
          <a href="/" className="text-xl font-bold text-yellow-400">
            CR Deck Builder
          </a>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-gray-800 px-4 py-4 text-center text-gray-400 text-sm">
          CR Deck Builder is not affiliated with Supercell. Clash Royale is a trademark of Supercell.
        </footer>
      </body>
    </html>
  );
}
