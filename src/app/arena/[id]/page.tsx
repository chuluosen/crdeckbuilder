import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getDecksForArena, getAllArenaCardPairs, getArenaIdsWithDecks, DECK_METADATA } from "@/lib/decks";
import { getCardBySlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import { OwnedCardsFilter } from "@/components/OwnedCardsFilter";
import Link from "next/link";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";
import { ARENA_CONTENT } from "@/lib/arena-content";
import { CardLink } from "@/components/CardLink";
import { ArenaSummary } from "@/components/ArenaSummary";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ARENAS.map((arena) => ({ id: arena.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const arena = ARENAS.find((a) => a.slug === id);
  if (!arena) return {};

  const allCards = await fetchAllCards();
  const decks = getDecksForArena(arena.id, allCards);

  const topDeck = [...decks]
    .filter((d) => d.winRate !== undefined)
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))[0];
  const topWinRate = topDeck ? `${Math.round(topDeck.winRate ?? 0)}%+ Win Rate` : "";

  return {
    title: topWinRate
      ? `Best Arena ${arena.id} Decks (${topWinRate}) — Filter by Your Cards | ${new Date().getFullYear()}`
      : `Best Arena ${arena.id} Decks — Filter by Your Cards | Clash Royale ${new Date().getFullYear()}`,
    description: `${decks.length} proven Clash Royale decks for Arena ${arena.id} (${arena.trophies}+ trophies)${topWinRate ? `, top deck at ${topWinRate.replace('+ Win Rate', '')} win rate` : ''}. Filter by cards you own and copy deck links to import. Updated ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}.`,
    alternates: {
      canonical: `/arena/${arena.slug}`,
    },
    robots: decks.length === 0 ? { index: false } : undefined,
  };
}

export default async function ArenaPage({ params }: Props) {
  const { id } = await params;
  const arena = ARENAS.find((a) => a.slug === id);
  if (!arena) notFound();

  const allCards = await fetchAllCards();
  const decks = getDecksForArena(arena.id, allCards);

  // Cards that unlock at this specific arena (content differentiation)
  const newCards = allCards.filter((c) => c.arena === arena.id);

  // Decks that FIRST become available at this arena
  const newDecks = decks.filter((deck) => {
    const maxArena = Math.max(...deck.cards.map((c) => c.arena));
    return maxArena === arena.id;
  });

  const allPairs = getAllArenaCardPairs();
  const arenaCards = allPairs
    .filter((p) => p.arenaSlug === arena.slug)
    .map((p) => {
      const c = getCardBySlug(p.cardSlug, allCards);
      return c ? { slug: p.cardSlug, name: c.name } : null;
    })
    .filter((c): c is { slug: string; name: string } => c !== null);

  const prevArena = ARENAS.find((a) => a.id === arena.id - 1);
  const nextArena = ARENAS.find((a) => a.id === arena.id + 1);

  const arenaIdsWithDecks = getArenaIdsWithDecks(allCards);
  const ctaArena = arenaIdsWithDecks.length > 0
    ? ARENAS.find((a) => a.id === arenaIdsWithDecks[0]) ?? null
    : null;

  // Top decks + popular cards for FAQ Schema and summary
  const top3Decks = [...decks]
    .filter((d) => d.winRate !== undefined)
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
    .slice(0, 3);

  const cardFreq = new Map<string, number>();
  for (const deck of decks) {
    for (const card of deck.cards) {
      cardFreq.set(card.name, (cardFreq.get(card.name) || 0) + 1);
    }
  }
  const topPopularCards = [...cardFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  const topDeckAnswer = top3Decks.length > 0
    ? `As of ${DECK_METADATA?.lastUpdated ? new Date(DECK_METADATA.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}, the best performing deck for Arena ${arena.id} features ${top3Decks[0].cards.sort((a, b) => b.elixirCost - a.elixirCost).slice(0, 3).map(c => c.name).join(', ')} and other cards, with a ${(top3Decks[0].winRate ?? 0).toFixed(1)}% win rate${top3Decks[0].sampleSize ? ` over ${top3Decks[0].sampleSize} matches` : ''}. We track ${decks.length} proven decks for this arena.`
    : `We found ${decks.length} top-performing decks for Arena ${arena.id} (${arena.name}), based on current meta win rates and usage statistics.`;

  const popularCardsAnswer = topPopularCards.length > 0
    ? `The most popular cards in Arena ${arena.id} (${arena.name}) right now are ${topPopularCards.join(', ')}. These cards appear most frequently across ${decks.length} competitive decks in the ${arena.trophies}+ trophy range.`
    : `Popular cards vary based on the current meta. Check back for updated statistics.`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `Arena ${arena.id}`, path: `/arena/${arena.slug}` },
  ]);
  const faqSchema = buildFaqSchema([
    {
      question: `What is the highest win rate deck for Arena ${arena.id} in Clash Royale?`,
      answer: topDeckAnswer,
    },
    {
      question: `What are the most popular cards in Clash Royale Arena ${arena.id}?`,
      answer: popularCardsAnswer,
    },
    {
      question: `How many trophies do I need for Arena ${arena.id}?`,
      answer: `You need ${arena.trophies} trophies to reach Arena ${arena.id} (${arena.name}) in Clash Royale.`,
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
        <span className="text-white">Arena {arena.id}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-1">
        Best Clash Royale Decks for Arena {arena.id} — {arena.name}
      </h1>
      <p className="text-gray-400 mb-4">
        {decks.length} winning decks you can build at Arena {arena.id} ({arena.name}, {arena.trophies}+ trophies).
        Proven in competitive play, filtered to cards available at this arena.
      </p>

      <ArenaSummary
        arenaId={arena.id}
        arenaName={arena.name}
        trophies={arena.trophies}
        decks={decks}
      />

      {decks.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center mb-8">
          <p className="text-gray-400 text-lg mb-2">
            No decks available for Arena {arena.id} yet.
          </p>
          <p className="text-gray-500 text-sm">
            We don&apos;t have enough data for this arena right now. Check back
            soon — we update our deck lists regularly as new meta data comes in.
          </p>
          {ctaArena && (
            <Link
              href={`/arena/${ctaArena.slug}`}
              className="inline-block mt-4 text-yellow-400 hover:underline"
            >
              Browse Arena {ctaArena.id}: {ctaArena.name} decks →
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-6">
            Arena {arena.id} ({arena.name}) unlocks at {arena.trophies} trophies.
            Below are {decks.length} proven decks using only cards available at this arena,
            sourced from high-level competitive play and ranked by win rate.
            Use the card filter above to find decks matching your collection.
            {arenaCards.length > 0 && ` You can also browse decks built around specific cards like ${arenaCards.slice(0, 3).map(c => c.name).join(", ")}${arenaCards.length > 3 ? ", and more" : ""}.`}
          </p>

          {/* Evidence block */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-300 mb-1">
              <strong className="text-yellow-400">Data Source:</strong> Top-ranked players from Path of Legend and Trophy Road across {DECK_METADATA?.regions || 25}+ regions.
              {DECK_METADATA && ` Based on ${DECK_METADATA.totalBattles.toLocaleString()} matches from ${DECK_METADATA.totalPlayers.toLocaleString()} players.`}
              {" "}Decks appear here if all 8 cards are unlockable at or before this arena.
            </p>
            <p className="text-xs text-gray-300 mb-1">
              <strong className="text-yellow-400">Last Updated:</strong> {DECK_METADATA?.lastUpdated ? new Date(DECK_METADATA.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
            </p>
            <p className="text-xs text-gray-400">
              Decks ranked using Bayesian average. Win rates reflect high-level competitive play, not this specific trophy range.
            </p>
          </div>

          {/* Owned cards filter + deck list — prominent position */}
          <OwnedCardsFilter
            allCards={allCards}
            decks={decks}
            arenaId={arena.id}
          />

          {/* New cards unlocked at this arena */}
          {newCards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-yellow-400">
                New Cards Unlocked at Arena {arena.id}
              </h2>
              <p className="text-gray-500 text-xs mb-3">
                {newCards.length} card{newCards.length !== 1 ? "s" : ""} become available when you reach {arena.name}.
              </p>
              <div className="flex flex-wrap gap-2">
                {newCards.map((card) => (
                  <div key={card.id} className="flex flex-col items-center w-16">
                    <div className="w-14 h-16 bg-gray-700 rounded overflow-hidden">
                      {card.iconUrl && (
                        <img src={card.iconUrl} alt={card.name} className="w-full h-full object-contain" loading="lazy" />
                      )}
                    </div>
                    <span className="text-xs text-gray-300 mt-1 text-center leading-tight">{card.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New decks that first become available at this arena */}
          {newDecks.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-green-400">
                New Decks at Arena {arena.id}
              </h2>
              <p className="text-gray-500 text-xs mb-3">
                {newDecks.length} deck{newDecks.length !== 1 ? "s" : ""} become possible for the first time at {arena.name}, using newly unlocked cards.
              </p>
              <div className="space-y-4 mb-4">
                {newDecks.map((deck, i) => (
                  <DeckCard key={`new-${i}`} deck={deck} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {ARENA_CONTENT[arena.id] && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-bold mb-2 text-yellow-400">
            Tips for Arena {arena.id} — {arena.name}
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {ARENA_CONTENT[arena.id].tip}
          </p>
        </div>
      )}

      {arenaCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Browse Decks by Card</h2>
          <div className="flex flex-wrap gap-2">
            {arenaCards.map((c) => (
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

      <div className="flex justify-between text-sm">
        {prevArena ? (
          <Link href={`/arena/${prevArena.slug}`} className="text-yellow-400 hover:underline">
            ← Arena {prevArena.id}: {prevArena.name}
          </Link>
        ) : <span />}
        {nextArena ? (
          <Link href={`/arena/${nextArena.slug}`} className="text-yellow-400 hover:underline">
            Arena {nextArena.id}: {nextArena.name} →
          </Link>
        ) : <span />}
      </div>
    </>
  );
}
