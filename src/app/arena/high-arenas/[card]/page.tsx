import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getHighArenaCardSlugs, getDecksForHighArenasCard, DECK_METADATA } from "@/lib/decks";
import { getCardBySlug, cardNameToSlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";
import { getCardArenaContent } from "@/lib/card-content";
import { CardLink } from "@/components/CardLink";

interface Props {
  params: Promise<{ card: string }>;
}

const HIGH_ARENAS = ARENAS.filter((a) => a.consolidated);
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
    title: `Best ${cardData.name} Decks for Arena 12-20 (High Arenas) - Clash Royale ${new Date().getFullYear()}`,
    description: `Top Clash Royale ${cardData.name} decks for Arena 12-20 (${LOWEST_HIGH_ARENA.name} to ${HIGHEST_HIGH_ARENA.name}). Win rates, usage stats for ${LOWEST_HIGH_ARENA.trophies}+ trophies. Updated ${new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}.`,
    alternates: {
      canonical: `/arena/high-arenas/${card}`,
    },
  };
}

export default async function HighArenasCardPage({ params }: Props) {
  const { card } = await params;
  const allCards = await fetchAllCards();
  const cardData = getCardBySlug(card, allCards);
  if (!cardData) notFound();

  const decks = getDecksForHighArenasCard(cardData.name, allCards);
  if (decks.length === 0) notFound();

  // Get other card pages for high arenas (for internal links)
  const otherCardSlugs = getHighArenaCardSlugs()
    .filter((slug) => slug !== card)
    .map((slug) => {
      const c = getCardBySlug(slug, allCards);
      return c ? { slug, name: c.name } : null;
    })
    .filter((c): c is { slug: string; name: string } => c !== null);

  const cardAppearances = decks.length;
  const avgWinRate =
    decks.reduce((sum, d) => sum + (d.winRate ?? 0), 0) / (decks.length || 1);

  // Use arena 12 context for the content generation (representative of high arenas)
  const cardArenaContent = getCardArenaContent(
    cardData,
    LOWEST_HIGH_ARENA.id,
    `${LOWEST_HIGH_ARENA.name} to ${HIGHEST_HIGH_ARENA.name}`,
    decks
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "High Arenas (12-20)", path: "/arena/high-arenas" },
    { name: cardData.name, path: `/arena/high-arenas/${card}` },
  ]);
  const faqSchema = buildFaqSchema([
    {
      question: `What are the best ${cardData.name} decks for Arena 12-20?`,
      answer: `We found ${decks.length} top-performing decks featuring ${cardData.name} for Arena 12-20 (${LOWEST_HIGH_ARENA.name} to ${HIGHEST_HIGH_ARENA.name}). These decks are based on current meta win rates and usage statistics from Path of Legend players.`,
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
        Top {decks.length} decks featuring {cardData.name} for {LOWEST_HIGH_ARENA.name} to{" "}
        {HIGHEST_HIGH_ARENA.name} ({LOWEST_HIGH_ARENA.trophies}+ trophies), ranked by win rate and
        usage stats.
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

      <p className="text-gray-500 text-sm mb-6">
        {cardData.name} is a {cardData.elixirCost}-elixir {cardData.rarity} card that appears in{" "}
        {cardAppearances} top-performing decks across Arena 12-20. Across these decks,{" "}
        {cardData.name} achieves an average win rate of {avgWinRate.toFixed(1)}%, making it a{" "}
        {avgWinRate >= 55 ? "strong" : "solid"} pick at the {LOWEST_HIGH_ARENA.trophies}+ trophy
        range and above.
      </p>

      <div className="space-y-4 mb-8">
        {decks.map((deck, i) => (
          <DeckCard key={i} deck={deck} index={i} />
        ))}
      </div>

      {cardArenaContent && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-bold mb-2 text-yellow-400">
            How to use {cardData.name} in Arena 12-20
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{cardArenaContent}</p>
        </div>
      )}

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
