import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ScrollTracker } from "@/components/ScrollTracker";

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
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DZCSFZGPRT" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DZCSFZGPRT');
        `}</Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","vqg57f7mn5");
        `}</Script>
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        <nav className="border-b border-gray-800 px-4 py-3">
          <a href="/" className="text-xl font-bold text-yellow-400">
            CR Deck Builder
          </a>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <ScrollTracker />
        <footer className="border-t border-gray-800 px-4 py-4 text-center text-gray-400 text-sm">
          <p>CR Deck Builder is not affiliated with Supercell. Clash Royale is a trademark of Supercell.</p>
          <p className="mt-1">
            <a href="/privacy" className="hover:text-yellow-400">Privacy Policy</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
