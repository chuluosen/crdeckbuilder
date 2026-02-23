import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getDecksForArenaCard, getAllArenaCardPairs } from "@/lib/decks";
import { getCardBySlug, cardNameToSlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";

interface Props {
  params: Promise<{ id: string; card: string }>;
}

export async function generateStaticParams() {
  return getAllArenaCardPairs().map((p) => ({
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
  return {
    title: `Best Arena ${arena.id} ${cardData.name} Decks - ${arena.name}`,
    description: `Top Clash Royale decks with ${cardData.name} for Arena ${arena.id} (${arena.name}). Win rates, usage stats for ${arena.trophies}+ trophies.`,
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

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `Arena ${arena.id}`, path: `/arena/${arena.slug}` },
    { name: cardData.name, path: `/arena/${arena.slug}/${card}` },
  ]);
  const faqSchema = buildFaqSchema([
    {
      question: `What are the best ${cardData.name} decks for Arena ${arena.id}?`,
      answer: `We found ${decks.length} top-performing decks featuring ${cardData.name} for Arena ${arena.id} (${arena.name}). These decks are based on current meta win rates and usage statistics.`,
    },
    {
      question: `Is ${cardData.name} good in Arena ${arena.id}?`,
      answer: `${cardData.name} appears in ${cardAppearances} top decks for Arena ${arena.id} (${arena.name}) with an average win rate of ${avgWinRate.toFixed(1)}%.`,
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
        Best Arena {arena.id} {cardData.name} Decks
      </h1>
      <p className="text-gray-400 mb-6">
        Top {decks.length} decks featuring {cardData.name} for {arena.name} ({arena.trophies}+ trophies).
        These decks are based on current meta win rates and usage statistics.
      </p>

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
            {cardData.elixirCost} Elixir · {cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1)}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {decks.map((deck, i) => (
          <DeckCard key={i} deck={deck} index={i} />
        ))}
      </div>

      {/* Internal links to other card pages in same arena */}
      {sameArenaCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">More Arena {arena.id} Decks by Card</h2>
          <div className="flex flex-wrap gap-2">
            {sameArenaCards.map((c) => (
              <Link
                key={c.slug}
                href={`/arena/${arena.slug}/${c.slug}`}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-yellow-400 hover:bg-gray-700"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm">
        <Link href={`/arena/${arena.slug}`} className="text-yellow-400 hover:underline">
          ← All Arena {arena.id} Decks
        </Link>
      </div>
    </>
  );
}
