import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getDecksForArena, getAllArenaCardPairs } from "@/lib/decks";
import { getCardBySlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import Link from "next/link";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";

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
  return {
    title: `Best Arena ${arena.id} Decks - ${arena.name}`,
    description: `Top Clash Royale decks for Arena ${arena.id} (${arena.name}). Win rates, usage stats, and card breakdowns for ${arena.trophies}+ trophies.`,
  };
}

export default async function ArenaPage({ params }: Props) {
  const { id } = await params;
  const arena = ARENAS.find((a) => a.slug === id);
  if (!arena) notFound();

  const allCards = await fetchAllCards();
  const decks = getDecksForArena(arena.id, allCards).slice(0, 12);

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

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: `Arena ${arena.id}`, path: `/arena/${arena.slug}` },
  ]);
  const faqSchema = buildFaqSchema([
    {
      question: `What are the best decks for Arena ${arena.id}?`,
      answer: `We found ${decks.length} top-performing decks for Arena ${arena.id} (${arena.name}). These decks are optimized for ${arena.trophies}+ trophies and are based on current meta win rates and usage statistics.`,
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
        Best Arena {arena.id} Decks
      </h1>
      <p className="text-gray-400 mb-4">
        Top decks for {arena.name} ({arena.trophies}+ trophies). These decks
        are based on current meta win rates and usage statistics.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        Arena {arena.id} ({arena.name}) unlocks at {arena.trophies} trophies.
        Below are {decks.length} proven decks that perform well at this trophy range.
        Each deck includes win rates, usage stats, and average elixir cost to help
        you pick the right strategy.
        {arenaCards.length > 0 && ` You can also browse decks built around specific cards like ${arenaCards.slice(0, 3).map(c => c.name).join(", ")}${arenaCards.length > 3 ? ", and more" : ""}.`}
      </p>

      <div className="space-y-4 mb-8">
        {decks.map((deck, i) => (
          <DeckCard key={i} deck={deck} index={i} />
        ))}
      </div>

      {arenaCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Browse Decks by Card</h2>
          <div className="flex flex-wrap gap-2">
            {arenaCards.map((c) => (
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
