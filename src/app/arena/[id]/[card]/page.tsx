import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ARENAS, Deck } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getDecksForArenaCard, getAllArenaCardPairs, DECK_METADATA } from "@/lib/decks";
import { getCardBySlug, cardNameToSlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";
import { getCardArenaContent } from "@/lib/card-content";
import { CardLink } from "@/components/CardLink";
import { getOpportunityGuide } from "@/lib/opportunity-content";

interface Props {
  params: Promise<{ id: string; card: string }>;
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
  return getAllArenaCardPairs()
    .map((p) => ({
      id: p.arenaSlug,
      card: p.cardSlug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, card } = await params;
  const arena = ARENAS.find((a) => a.slug === id);
  const allCards = await fetchAllCards();
  const cardData = getCardBySlug(card, allCards);
  if (!arena || !cardData) return {};
  const guide = getOpportunityGuide(arena.slug, card);

  return {
    title: guide?.title ?? `Best Clash Royale ${cardData.name} Decks for Arena ${arena.id} - ${arena.name}`,
    description:
      guide?.description ??
      `Top Clash Royale decks with ${cardData.name} for Arena ${arena.id} (${arena.name}). Win rates, usage stats for ${arena.trophies}+ trophies.`,
    alternates: {
      canonical: `/arena/${arena.slug}/${card}`,
    },
  };
}

export default async function ArenaCardPage({ params }: Props) {
  const { id, card } = await params;
  const arena = ARENAS.find((a) => a.slug === id);
  if (!arena) notFound();

  const allCards = await fetchAllCards();
  const cardData = getCardBySlug(card, allCards);
  if (!cardData) notFound();

  const decks = getDecksForArenaCard(arena.id, cardData.name, allCards);
  if (decks.length === 0) notFound();

  // Get other card pages for this arena (for internal links)
  const allPairs = getAllArenaCardPairs();
  const sameArenaCards = allPairs
    .filter((p) => p.arenaSlug === arena.slug && p.cardSlug !== card)
    .map((p) => {
      const c = getCardBySlug(p.cardSlug, allCards);
      return c ? { slug: p.cardSlug, name: c.name } : null;
    })
    .filter((c): c is { slug: string; name: string } => c !== null);

  const cardAppearances = decks.length;
  const avgWinRate = decks.reduce((sum, d) => sum + (d.winRate ?? 0), 0) / (decks.length || 1);
  const totalSampleSize = decks.reduce((sum, d) => sum + (d.sampleSize ?? 0), 0);
  const dataUpdated = DECK_METADATA?.lastUpdated
    ? new Date(DECK_METADATA.lastUpdated).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "recently";
  const cardArenaContent = getCardArenaContent(cardData, arena.id, arena.name, decks);
  const guide = getOpportunityGuide(arena.slug, card);
  const topCoCards = getTopCoCards(decks, cardData.name);
  const topCoCardText = formatCardList(topCoCards);
  const avgElixir =
    decks.reduce((sum, d) => sum + d.avgElixir, 0) / (decks.length || 1);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `Arena ${arena.id}`, path: `/arena/${arena.slug}` },
    { name: cardData.name, path: `/arena/${arena.slug}/${card}` },
  ]);
  const faqSchema = buildFaqSchema([
    {
      question: `What are the best ${cardData.name} decks for Arena ${arena.id}?`,
      answer: `We found ${decks.length} top-performing decks featuring ${cardData.name} for Arena ${arena.id} (${arena.name}). These decks are ranked by win rate, usage, and sample size from recorded top ladder battles.`,
    },
    {
      question: `Is ${cardData.name} good in Arena ${arena.id}?`,
      answer: `${cardData.name} appears in ${cardAppearances} top decks for Arena ${arena.id} (${arena.name}) with an average recorded win rate of ${avgWinRate.toFixed(1)}%${totalSampleSize > 0 ? ` across ${totalSampleSize.toLocaleString()} matches` : ""}.`,
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
        <Link href={`/arena/${arena.slug}`} className="hover:text-yellow-400">Arena {arena.id}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{cardData.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-1">
        {guide?.h1 ?? `Best Arena ${arena.id} ${cardData.name} Decks`}
      </h1>
      <p className="text-gray-400 mb-4">
        {guide?.intro ??
          `Top ${decks.length} decks featuring ${cardData.name} for ${arena.name} (${arena.trophies}+ trophies). These decks are ranked by win rate, usage, and sample size from recorded top ladder battles.`}
      </p>
      <p className="text-gray-500 text-sm mb-6">
        {guide
          ? `${cardData.name} appears in ${cardAppearances} Arena ${arena.id} deck option${cardAppearances !== 1 ? "s" : ""} in this dataset. These lists average ${avgElixir.toFixed(1)} elixir and ${avgWinRate.toFixed(1)}% recorded win rate${totalSampleSize > 0 ? ` across ${totalSampleSize.toLocaleString()} matches` : ""}. The most common support cards shown with ${cardData.name} here are ${topCoCardText}.`
          : `${cardData.name} is a ${cardData.elixirCost}-elixir ${cardData.rarity} card that appears in ${cardAppearances} top-performing decks for Arena ${arena.id}. Across these recorded decks, ${cardData.name} has an average win rate of ${avgWinRate.toFixed(1)}%${totalSampleSize > 0 ? ` across ${totalSampleSize.toLocaleString()} matches` : ""}, making it a ${avgWinRate >= 55 ? "strong" : "solid"} pick for players who have it unlocked.`}
      </p>

      {guide && (
        <section className="mb-6 border-l-4 border-yellow-400 pl-4">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">
            Arena {arena.id} {cardData.name} Playbook
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

      {/* Card info */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6 flex items-center gap-4">
        <div className="w-20 h-24 bg-gray-700 rounded overflow-hidden flex-shrink-0">
          {cardData.iconUrl && (
            <img src={cardData.iconUrl} alt={cardData.name} className="w-full h-full object-contain" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-yellow-400">{cardData.name}</h2>
          <p className="text-sm text-gray-400">
            {cardData.elixirCost} Elixir - {cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1)}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 text-xs text-gray-400 space-y-1">
        <p>
          <strong className="text-yellow-400">Data Source:</strong> recorded top ladder player battles from the official Clash Royale API.
          {DECK_METADATA && ` This dataset includes ${DECK_METADATA.totalBattles.toLocaleString()} matches from ${DECK_METADATA.totalPlayers.toLocaleString()} players.`}
        </p>
        <p>
          <strong className="text-yellow-400">Last Updated:</strong> {dataUpdated}
          {totalSampleSize > 0 && ` - ${totalSampleSize.toLocaleString()} recorded matches across these ${cardData.name} decks`}
        </p>
        <p>
          Decks are ranked using Bayesian average. Win rates reflect high-level competitive play and may not match every trophy range or player skill level.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {decks.map((deck, i) => (
          <DeckCard key={i} deck={deck} index={i} />
        ))}
      </div>

      {cardArenaContent && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-bold mb-2 text-yellow-400">
            How to use {cardData.name} in Arena {arena.id}
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {cardArenaContent}
          </p>
        </div>
      )}

      {sameArenaCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">More Arena {arena.id} Decks by Card</h2>
          <div className="flex flex-wrap gap-2">
            {sameArenaCards.map((c) => (
              <CardLink
                key={c.slug}
                href={`/arena/${arena.slug}/${c.slug}`}
                cardName={c.name}
                arenaId={arena.id}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-sm">
        <Link href={`/arena/${arena.slug}`} className="text-yellow-400 hover:underline">
          &lt;- All Arena {arena.id} Decks
        </Link>
      </div>
    </>
  );
}
