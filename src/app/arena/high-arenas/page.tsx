import { Metadata } from "next";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getDecksForArena } from "@/lib/decks";
import { DeckCard } from "@/components/DeckCard";
import Link from "next/link";
import { buildBreadcrumbSchema } from "@/lib/jsonld";
import { DECK_METADATA } from "@/lib/decks";

const HIGH_ARENAS = ARENAS.filter(a => a.id >= 12 && a.id <= 20);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Best Clash Royale Decks for Arena 12-20 (High Arenas & Endgame Meta) 2026`,
    description: `Best Clash Royale decks for Arena 12-20 (Spooky Town to Legendary Arena). Top endgame meta decks ranked by win rate from Path of Legend players. Updated ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}.`,
    alternates: {
      canonical: `/arena/high-arenas`,
    },
  };
}

export default async function HighArenasPage() {
  const allCards = await fetchAllCards();
  // Get decks for Arena 12+ (all high arena decks)
  const decks = getDecksForArena(12, allCards).slice(0, 79);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "High Arenas (12-20)", path: "/arena/high-arenas" },
  ]);

  const lastUpdated = DECK_METADATA?.lastUpdated
    ? new Date(DECK_METADATA.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-white">High Arenas (12-20)</span>
      </nav>

      <h1 className="text-3xl font-bold mb-1">
        Best Decks for Arena 12-20 — Spooky Town to Legendary Arena
      </h1>
      <p className="text-gray-400 mb-4">
        Top {decks.length} endgame meta decks for Arena 12-20, ranked by win rate and usage stats from Path of Legend players.
      </p>

      {/* Evidence block */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300 mb-2">
          <strong className="text-yellow-400">Data Source:</strong> Top Path of Legend players across {DECK_METADATA?.regions || 10} regions.
          {DECK_METADATA && ` Based on ${DECK_METADATA.totalBattles.toLocaleString()} matches from ${DECK_METADATA.totalPlayers.toLocaleString()} players.`}
        </p>
        <p className="text-sm text-gray-300 mb-2">
          <strong className="text-yellow-400">Last Updated:</strong> {lastUpdated}
        </p>
        <p className="text-xs text-gray-400">
          Decks ranked using Bayesian average. All decks shown are legal for Arena 12+ based on card unlock requirements.
        </p>
      </div>

      {/* Quick navigation */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold mb-3 text-yellow-400">Jump to Arena:</h2>
        <div className="flex flex-wrap gap-2">
          {HIGH_ARENAS.map(arena => (
            <a
              key={arena.id}
              href={`#arena-${arena.id}`}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
            >
              Arena {arena.id}
            </a>
          ))}
        </div>
      </div>

      {/* Arena sections */}
      {HIGH_ARENAS.map(arena => (
        <div key={arena.id} id={`arena-${arena.id}`} className="mb-8 scroll-mt-4">
          <h2 className="text-2xl font-bold mb-2 text-yellow-400">
            Arena {arena.id}: {arena.name}
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            {arena.trophies}+ trophies required. All {decks.length} decks below are viable from Arena {arena.id} onwards.
          </p>
        </div>
      ))}

      {/* Display all decks once */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">All Endgame Meta Decks</h2>
        <p className="text-gray-400 text-sm mb-4">
          These {decks.length} decks represent the current endgame meta from top Path of Legend players.
          All decks are legal for Arena 12+ based on card unlock requirements.
        </p>
        <div className="space-y-4">
          {decks.map((deck, i) => (
            <DeckCard key={i} deck={deck} index={i} />
          ))}
        </div>
      </div>

      {/* Navigation to individual arenas */}
      <div className="flex justify-between text-sm mt-8">
        <Link href="/arena/arena-11" className="text-yellow-400 hover:underline">
          ← Arena 11: Electro Valley
        </Link>
        <Link href="/" className="text-yellow-400 hover:underline">
          Back to Home
        </Link>
      </div>
    </>
  );
}
