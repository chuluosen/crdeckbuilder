import { Card, Deck, ARENAS } from "./data";
import { cardNameToSlug, HOT_CARDS } from "./cards";
import generatedDecks from "./generated-decks.json";
import starterDecks from "./starter-decks.json";
import cardsJson from "./cards.json";

interface ArenaDeckData {
  [arenaId: number]: { cards: string[]; winRate: number; useRate: number }[];
}

type DeckEntry = { cards: string[]; winRate: number; useRate: number };

const META_DECKS: ArenaDeckData = generatedDecks as unknown as ArenaDeckData;

// Valid card names from cards.json for validation
const validCardNames = new Set<string>(
  (cardsJson as { name: string }[]).map((c) => c.name)
);

// Card arena lookup from cards.json (name → arena)
const cardArenaMap = new Map<string, number>(
  (cardsJson as { name: string; arena: number }[]).map((c) => [c.name, c.arena])
);

// Flatten META_DECKS into a single pool (identical across arenas)
const META_DECK_POOL: DeckEntry[] = Object.values(META_DECKS).flat();

// Merge meta + starter decks into one pool; skip any deck with invalid card names
const ALL_DECKS: DeckEntry[] = [...META_DECK_POOL, ...(starterDecks as DeckEntry[])]
  .filter((d) => d.cards.every((name) => validCardNames.has(name)));

export function getDecksForArena(arenaId: number, allCards: Card[]): Deck[] {
  const cardMap = new Map(allCards.map((c) => [c.name, c]));

  return ALL_DECKS
    .map((d) => {
      const cards = d.cards
        .map((name) => cardMap.get(name))
        .filter((c): c is Card => c !== undefined);
      const avgElixir =
        cards.length > 0
          ? Math.round((cards.reduce((sum, c) => sum + c.elixirCost, 0) / cards.length) * 10) / 10
          : 0;
      return { cards, avgElixir, winRate: d.winRate, useRate: d.useRate };
    })
    .filter((deck) => deck.cards.length === 8 && deck.cards.every((c) => c.arena <= arenaId));
}

export function getDecksForArenaCard(arenaId: number, cardName: string, allCards: Card[]): Deck[] {
  const allDecks = getDecksForArena(arenaId, allCards);
  return allDecks.filter((deck) => deck.cards.some((c) => c.name === cardName));
}

export function getAllArenaCardPairs(): { arenaSlug: string; cardSlug: string }[] {
  const pairs: { arenaSlug: string; cardSlug: string }[] = [];

  for (const arena of ARENAS) {
    const cardCounts = new Map<string, number>();
    for (const deck of ALL_DECKS) {
      // Only count decks where all cards are available at this arena
      const allAvailable = deck.cards.every((name) => {
        const cardArena = cardArenaMap.get(name);
        return cardArena !== undefined && cardArena <= arena.id;
      });
      if (!allAvailable) continue;

      for (const cardName of deck.cards) {
        if (HOT_CARDS.includes(cardName)) {
          cardCounts.set(cardName, (cardCounts.get(cardName) || 0) + 1);
        }
      }
    }
    for (const [cardName, count] of cardCounts) {
      if (count >= 3) {
        pairs.push({ arenaSlug: arena.slug, cardSlug: cardNameToSlug(cardName) });
      }
    }
  }

  return pairs;
}

export function getArenaIdsWithDecks(allCards: Card[]): number[] {
  return ARENAS
    .filter((arena) => getDecksForArena(arena.id, allCards).length > 0)
    .map((arena) => arena.id);
}
