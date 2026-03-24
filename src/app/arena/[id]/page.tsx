import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ARENAS } from "@/lib/data";
import { fetchAllCards } from "@/lib/api";
import { getDecksForArena, getAllArenaCardPairs, getArenaIdsWithDecks } from "@/lib/decks";
import { getCardBySlug } from "@/lib/cards";
import { DeckCard } from "@/components/DeckCard";
import Link from "next/link";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";
import { ARENA_CONTENT } from "@/lib/arena-content";
import { CardLink } from "@/components/CardLink";

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

  return {
    title: `Best Arena ${arena.id} Decks (${arena.name}) - Clash Royale ${new Date().getFullYear()}`,
    description: `Best Clash Royale decks for Arena ${arena.id} (${arena.name}, ${arena.trophies}+ trophies). Top meta decks ranked by win rate and usage stats. Updated ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}.`,
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

  const arenaIdsWithDecks = getArenaIdsWithDecks(allCards);
  const ctaArena = arenaIdsWithDecks.length > 0
    ? ARENAS.find((a) => a.id === arenaIdsWithDecks[0]) ?? null
    : null;

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
        Best Clash Royale Decks for Arena {arena.id} — {arena.name}
      </h1>
      <p className="text-gray-400 mb-4">
        Top {decks.length} meta decks for Arena {arena.id} ({arena.name}, {arena.trophies}+ trophies),
        ranked by win rate and usage stats.
      </p>

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
            Below are {decks.length} proven decks that perform well at this trophy range.
            Each deck includes win rates, usage stats, and average elixir cost to help
            you pick the right strategy.
            {arenaCards.length > 0 && ` You can also browse decks built around specific cards like ${arenaCards.slice(0, 3).map(c => c.name).join(", ")}${arenaCards.length > 3 ? ", and more" : ""}.`}
          </p>

          <p className="text-xs text-gray-500 mb-4 italic">
            Data based on top ladder player battles. Win rates reflect high-level play; consider usage rate and sample size when evaluating decks.
          </p>

          <div className="space-y-4 mb-8">
            {decks.map((deck, i) => (
              <DeckCard key={i} deck={deck} index={i} />
            ))}
          </div>
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
