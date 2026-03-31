import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getHighArenaCardSlugs, getDecksForHighArenasCard, getDecksForHighArenasCardGrouped, DECK_METADATA } from "@/lib/decks";
import type { ArenaGroup } from "@/lib/decks";
import { getCardBySlug, cardNameToSlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";
import { CardLink } from "@/components/CardLink";

interface Props {
  params: Promise<{ card: string }>;
}

const HIGH_ARENAS = ARENAS.filter((a) => a.id >= 12 && a.id <= 20);
const LOWEST_HIGH_ARENA = HIGH_ARENAS[0];
const HIGHEST_HIGH_ARENA = HIGH_ARENAS[HIGH_ARENAS.length - 1];

export async function generateStaticParams() {
  return getHighArenaCardSlugs().map((slug) => ({ card: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { card } = await params;
  const allCards = await fetchAllCards();
  const cardData = getCardBySlug(card, allCards);
  if (!cardData) return {};
  return {
    title: `Best ${cardData.name} Decks: Arena 15, 17, 19+ (${new Date().getFullYear()} Meta)`,
    description: `Top ${cardData.name} decks for Clash Royale Arena 12-20 — Miner's Mine (Arena 15), Royal Crypt (Arena 17), Dragon Spa (Arena 19) to Legendary Arena. Win rates and usage stats from Path of Legend players. Updated ${new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}.`,
    alternates: {
      canonical: `/arena/high-arenas/${card}`,
    },
  };
}

function ArenaSection({ group, cardName }: { group: ArenaGroup; cardName: string }) {
  const arena = ARENAS.find((a) => a.id === group.arenaId);
  if (!arena) return null;

  return (
    <div id={`arena-${group.arenaId}`} className="mb-8 scroll-mt-4">
      <h2 className="text-2xl font-bold mb-2 text-yellow-400">
        {cardName} Decks for Arena {group.arenaId} ({group.arenaName})
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        {arena.trophies}+ trophies required.
      </p>

      {group.decks.length > 0 ? (
        <div className="space-y-4">
          {group.decks.map((deck, i) => (
            <DeckCard key={i} deck={deck} index={i} />
          ))}
        </div>
      ) : group.fallbackContext?.type === "look_down" ? (
        <p className="text-gray-500 text-sm italic">
          While {cardName} is available at this level, its most competitive modern decks
          require supporting cards from higher arenas. Check out the optimized builds starting
          at Arena {group.fallbackContext.referenceArenaId} below.
        </p>
      ) : group.fallbackContext?.type === "look_up" ? (
        <p className="text-gray-500 text-sm italic">
          {cardName} continues to dominate in {group.arenaName} (Arena {group.arenaId}).
          Since the new unlocks at this trophy range don&apos;t fundamentally shift
          the {cardName} meta, climb the ladder using the proven
          Arena {group.fallbackContext.referenceArenaId} builds above.
        </p>
      ) : null}
    </div>
  );
}

export default async function HighArenasCardPage({ params }: Props) {
  const { card } = await params;
  const allCards = await fetchAllCards();
  const cardData = getCardBySlug(card, allCards);
  if (!cardData) notFound();

  const allDecks = getDecksForHighArenasCard(cardData.name, allCards);
  if (allDecks.length === 0) notFound();

  const arenaGroups = getDecksForHighArenasCardGrouped(cardData.name, cardData.arena, allCards);

  // Get other card pages for high arenas (for internal links)
  const otherCardSlugs = getHighArenaCardSlugs()
    .filter((slug) => slug !== card)
    .map((slug) => {
      const c = getCardBySlug(slug, allCards);
      return c ? { slug, name: c.name } : null;
    })
    .filter((c): c is { slug: string; name: string } => c !== null);

  const cardAppearances = allDecks.length;
  const avgWinRate =
    allDecks.reduce((sum, d) => sum + (d.winRate ?? 0), 0) / (allDecks.length || 1);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "High Arenas (12-20)", path: "/arena/high-arenas" },
    { name: cardData.name, path: `/arena/high-arenas/${card}` },
  ]);
  const faqSchema = buildFaqSchema([
    {
      question: `What are the best ${cardData.name} decks for Arena 12-20?`,
      answer: `We found ${allDecks.length} top-performing decks featuring ${cardData.name} for Arena 12-20 (${LOWEST_HIGH_ARENA.name} to ${HIGHEST_HIGH_ARENA.name}). These decks are based on current meta win rates and usage statistics from Path of Legend players.`,
    },
    {
      question: `Is ${cardData.name} good in high arenas (Arena 12-20)?`,
      answer: `${cardData.name} appears in ${cardAppearances} top decks for Arena 12-20 with an average win rate of ${avgWinRate.toFixed(1)}%, making it a ${avgWinRate >= 55 ? "strong" : "solid"} pick at ${LOWEST_HIGH_ARENA.trophies}+ trophies.`,
    },
  ]);

  const lastUpdated = DECK_METADATA?.lastUpdated
    ? new Date(DECK_METADATA.lastUpdated).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/arena/high-arenas" className="hover:text-yellow-400">High Arenas (12-20)</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{cardData.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-1">
        Best {cardData.name} Decks for Arena 12-20
      </h1>
      <p className="text-gray-400 mb-4">
        Top {allDecks.length} decks featuring {cardData.name} across {LOWEST_HIGH_ARENA.name} (Arena {LOWEST_HIGH_ARENA.id}) to{" "}
        {HIGHEST_HIGH_ARENA.name} (Arena {HIGHEST_HIGH_ARENA.id}), ranked by win rate and
        usage stats from Path of Legend players.
      </p>

      {/* Card info */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4 flex items-center gap-4">
        <div className="w-20 h-24 bg-gray-700 rounded overflow-hidden flex-shrink-0">
          {cardData.iconUrl && (
            <img src={cardData.iconUrl} alt={cardData.name} className="w-full h-full object-contain" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-yellow-400">{cardData.name}</h2>
          <p className="text-sm text-gray-400">
            {cardData.elixirCost} Elixir &middot;{" "}
            {cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1)}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {cardAppearances} decks &middot; {avgWinRate.toFixed(1)}% avg win rate
          </p>
        </div>
      </div>

      {/* Evidence block */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-300 mb-1">
          <strong className="text-yellow-400">Data Source:</strong> Top Path of Legend players.
          {DECK_METADATA &&
            ` Based on ${DECK_METADATA.totalBattles.toLocaleString()} matches from ${DECK_METADATA.totalPlayers.toLocaleString()} players.`}
        </p>
        <p className="text-xs text-gray-300 mb-1">
          <strong className="text-yellow-400">Last Updated:</strong> {lastUpdated}
        </p>
        <p className="text-xs text-gray-400">
          Data based on top ladder player battles. Win rates reflect high-level play; consider usage
          rate and sample size when evaluating decks.
        </p>
      </div>

      {/* Quick arena navigation */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold mb-3 text-yellow-400">Jump to Arena:</h2>
        <div className="flex flex-wrap gap-2">
          {arenaGroups.map((g) => (
            <a
              key={g.arenaId}
              href={`#arena-${g.arenaId}`}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
            >
              Arena {g.arenaId}
            </a>
          ))}
        </div>
      </div>

      {/* Arena-grouped deck sections */}
      {arenaGroups.map((group) => (
        <ArenaSection key={group.arenaId} group={group} cardName={cardData.name} />
      ))}

      {otherCardSlugs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">More High Arena Decks by Card</h2>
          <div className="flex flex-wrap gap-2">
            {otherCardSlugs.map((c) => (
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

      <div className="text-sm">
        <Link href="/arena/high-arenas" className="text-yellow-400 hover:underline">
          &larr; All High Arena Decks
        </Link>
      </div>
    </>
  );
}
