import { Metadata } from "next";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getDecksForArena, getHighArenaCardSlugs } from "@/lib/decks";
import { DeckCard } from "@/components/DeckCard";
import Link from "next/link";
import { buildBreadcrumbSchema } from "@/lib/jsonld";
import { DECK_METADATA } from "@/lib/decks";
import { getCardBySlug } from "@/lib/cards";
import { CardLink } from "@/components/CardLink";

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
  // Get all decks for Arena 12+
  const allDecks = getDecksForArena(12, allCards);

  // Get card pages for internal linking
  const highArenaCards = getHighArenaCardSlugs()
    .map((slug) => {
      const c = getCardBySlug(slug, allCards);
      return c ? { slug, name: c.name } : null;
    })
    .filter((c): c is { slug: string; name: string } => c !== null);

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
        Top {allDecks.length} endgame meta decks for Arena 12-20, ranked by win rate and usage stats from Path of Legend players.
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

      {/* Arena sections - show new decks per arena */}
      {HIGH_ARENAS.map(arena => {
        // Filter decks that first become available at this arena
        // We need to check the raw deck data since Deck type doesn't expose firstAvailableArena
        const newDecks = allDecks.filter(deck => {
          // Calculate firstAvailableArena from the deck's cards
          const maxArena = Math.max(...deck.cards.map(c => c.arena));
          return maxArena === arena.id;
        });

        return (
          <div key={arena.id} id={`arena-${arena.id}`} className="mb-8 scroll-mt-4">
            <h2 className="text-2xl font-bold mb-2 text-yellow-400">
              Arena {arena.id}: {arena.name}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {arena.trophies}+ trophies required.
              {newDecks.length > 0
                ? ` ${newDecks.length} new deck${newDecks.length > 1 ? 's' : ''} unlock at this arena.`
                : ' No new decks unlock at this arena - all previous decks remain viable.'}
            </p>

            {newDecks.length > 0 && (
              <div className="space-y-4 mb-6">
                {newDecks.map((deck, i) => (
                  <DeckCard key={i} deck={deck} index={i} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Browse Decks by Card */}
      {highArenaCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Browse Decks by Card</h2>
          <div className="flex flex-wrap gap-2">
            {highArenaCards.map((c) => (
              <CardLink
                key={c.slug}
                href={`/arena/high-arenas/${c.slug}`}
                cardName={c.name}
                arenaId={12}
              />
            ))}
          </div>
        </div>
      )}

      {/* Display all decks */}
      <div className="mb-8 mt-12">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">All Endgame Meta Decks</h2>
        <p className="text-gray-400 text-sm mb-4">
          All {allDecks.length} decks available for Arena 12+. These represent the current endgame meta from top Path of Legend players.
        </p>
        <div className="space-y-4">
          {allDecks.map((deck, i) => (
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
