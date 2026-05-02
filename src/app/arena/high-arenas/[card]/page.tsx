import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllCards } from "@/lib/api";
import { ARENAS, Deck } from "@/lib/data";
import {
  DECK_METADATA,
  getDecksForHighArenasCard,
  getHighArenaCardSlugs,
} from "@/lib/decks";
import { cardNameToSlug, getCardBySlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";
import { getCardArenaContent } from "@/lib/card-content";
import { getOpportunityGuide } from "@/lib/opportunity-content";

interface Props {
  params: Promise<{ card: string }>;
}

function getTopCoCards(decks: Deck[], focalCardName: string, limit = 3): string[] {
  const counts = new Map<string, number>();

  for (const deck of decks) {
    for (const card of deck.cards) {
      if (card.name === focalCardName) continue;
      counts.set(card.name, (counts.get(card.name) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

function formatCardList(names: string[]): string {
  if (names.length === 0) return "the support cards shown in the deck list";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;

  const head = names.slice(0, -1).join(", ");
  const last = names[names.length - 1];
  return `${head}, and ${last}`;
}

export async function generateStaticParams() {
  return getHighArenaCardSlugs().map((card) => ({ card }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { card } = await params;
  const allCards = await fetchAllCards();
  const cardData = getCardBySlug(card, allCards);
  if (!cardData) return {};
  const guide = getOpportunityGuide("high-arenas", card);

  const title =
    guide?.title ??
    (cardData.name === "Royal Giant"
      ? "Best Royal Giant Decks 2026 - Clash Royale High Arena Decks"
      : `Best ${cardData.name} Decks 2026 - Clash Royale High Arena Decks`);

  return {
    title,
    description:
      guide?.description ??
      `Best ${cardData.name} decks for Clash Royale high arenas 12-20. Compare decks ranked by win rate, usage, and sample size, then copy a deck link into the game.`,
    alternates: {
      canonical: `/arena/high-arenas/${card}`,
    },
  };
}

export default async function HighArenaCardPage({ params }: Props) {
  const { card } = await params;
  const allCards = await fetchAllCards();
  const cardData = getCardBySlug(card, allCards);
  if (!cardData) notFound();

  const decks = getDecksForHighArenasCard(cardData.name, allCards);
  if (decks.length === 0) notFound();

  const topDecks = [...decks]
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
    .slice(0, 10);
  const totalSampleSize = topDecks.reduce((sum, deck) => sum + (deck.sampleSize ?? 0), 0);
  const avgWinRate = topDecks.reduce((sum, deck) => sum + (deck.winRate ?? 0), 0) / topDecks.length;
  const avgElixir = topDecks.reduce((sum, deck) => sum + deck.avgElixir, 0) / topDecks.length;
  const dataUpdated = DECK_METADATA?.lastUpdated
    ? new Date(DECK_METADATA.lastUpdated).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "recently";
  const cardContent = getCardArenaContent(cardData, 20, "High Arenas", topDecks);
  const guide = getOpportunityGuide("high-arenas", card);
  const topCoCards = getTopCoCards(topDecks, cardData.name);
  const topCoCardText = formatCardList(topCoCards);
  const relatedCards = getHighArenaCardSlugs()
    .filter((slug) => slug !== card)
    .slice(0, 10)
    .map((slug) => getCardBySlug(slug, allCards))
    .filter((related): related is NonNullable<typeof related> => related !== null);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "High Arena Decks", path: "/arena/arena-20" },
    { name: cardData.name, path: `/arena/high-arenas/${card}` },
  ]);
  const faqSchema = buildFaqSchema([
    {
      question: `What are the best ${cardData.name} decks for high arenas?`,
      answer: `We found ${topDecks.length} ${cardData.name} decks for Clash Royale high arenas. Decks are ranked by win rate, usage, and sample size from recorded top ladder battles.`,
    },
    {
      question: `Is ${cardData.name} good in high arenas?`,
      answer: `${cardData.name} appears in ${decks.length} high-arena deck options in our dataset, with the top listed decks averaging ${avgWinRate.toFixed(1)}% recorded win rate${totalSampleSize > 0 ? ` across ${totalSampleSize.toLocaleString()} matches` : ""}.`,
    },
  ]);

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
        <Link href="/arena/arena-20" className="hover:text-yellow-400">High Arenas</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{cardData.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-1">
        {guide?.h1 ?? `Best ${cardData.name} Decks for High Arenas`}
      </h1>
      <p className="text-gray-400 mb-4">
        {guide?.intro ??
          `Clash Royale ${cardData.name} decks for Arenas 12-20, ranked by win rate, usage, and sample size. These lists focus on high-arena ladder decks you can copy and test quickly.`}
      </p>
      <p className="text-gray-500 text-sm mb-6">
        {cardData.name} appears in {decks.length} high-arena deck option{decks.length !== 1 ? "s" : ""} in this dataset.
        The top {topDecks.length} listed decks average {avgElixir.toFixed(1)} elixir and {avgWinRate.toFixed(1)}% recorded win rate{totalSampleSize > 0 ? ` across ${totalSampleSize.toLocaleString()} matches` : ""}.
        {guide && ` Common support cards in these top lists include ${topCoCardText}.`}
      </p>

      {guide && (
        <section className="mb-6 border-l-4 border-yellow-400 pl-4">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">
            High-Arena {cardData.name} Playbook
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {guide.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="font-semibold text-white mb-1">{section.heading}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 text-xs text-gray-400 space-y-1">
        <p>
          <strong className="text-yellow-400">Data Source:</strong> recorded top ladder player battles from the official Clash Royale API.
          {DECK_METADATA && ` This dataset includes ${DECK_METADATA.totalBattles.toLocaleString()} matches from ${DECK_METADATA.totalPlayers.toLocaleString()} players.`}
        </p>
        <p>
          <strong className="text-yellow-400">Last Updated:</strong> {dataUpdated}
          {totalSampleSize > 0 && ` - ${totalSampleSize.toLocaleString()} recorded matches across the top ${cardData.name} decks shown here`}
        </p>
        <p>
          Decks are ranked using Bayesian average. Win rates reflect high-level competitive play and may not match every trophy range or player skill level.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {topDecks.map((deck, index) => (
          <DeckCard key={index} deck={deck} index={index} />
        ))}
      </div>

      {cardContent && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-bold mb-2 text-yellow-400">
            How to use {cardData.name} in high arenas
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{cardContent}</p>
        </div>
      )}

      {relatedCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">More High Arena Decks by Card</h2>
          <div className="flex flex-wrap gap-2">
            {relatedCards.map((relatedCard) => (
              <Link
                key={relatedCard.id}
                href={`/arena/high-arenas/${cardNameToSlug(relatedCard.name)}`}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-yellow-400 hover:border-yellow-400"
              >
                {relatedCard.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm">
        <Link href="/arena/arena-20" className="text-yellow-400 hover:underline">
          Browse all Arena 20 decks -&gt;
        </Link>
      </div>
    </>
  );
}
