import { Card, Deck, ARENAS } from "./data";
import { cardNameToSlug, HOT_CARDS } from "./cards";
import generatedDecks from "./generated-decks.json";

interface ArenaDeckData {
  [arenaId: number]: { cards: string[]; winRate: number; useRate: number }[];
}

const META_DECKS: ArenaDeckData = generatedDecks as unknown as ArenaDeckData;

const FALLBACK_DECKS = [
  { cards: ["Hog Rider", "Valkyrie", "Musketeer", "Fireball", "Zap", "Skeletons", "Ice Spirit", "Cannon"], winRate: 55, useRate: 5.0 },
  { cards: ["Giant", "Musketeer", "Mini P.E.K.K.A", "Arrows", "Fireball", "Archers", "Knight", "Skeleton Army"], winRate: 54, useRate: 4.5 },
  { cards: ["P.E.K.K.A", "Wizard", "Baby Dragon", "Tombstone", "Arrows", "Minions", "Knight", "Zap"], winRate: 53, useRate: 4.0 },
];

export function getDecksForArena(arenaId: number, allCards: Card[]): Deck[] {
  const cardMap = new Map(allCards.map((c) => [c.name, c]));
  const deckData = META_DECKS[arenaId] || FALLBACK_DECKS;

  return deckData.map((d) => {
    const cards = d.cards
      .map((name) => cardMap.get(name))
      .filter((c): c is Card => c !== undefined);
    const avgElixir =
      cards.length > 0
        ? Math.round((cards.reduce((sum, c) => sum + c.elixirCost, 0) / cards.length) * 10) / 10
        : 0;
    return { cards, avgElixir, winRate: d.winRate, useRate: d.useRate };
  });
}

export function getDecksForArenaCard(arenaId: number, cardName: string, allCards: Card[]): Deck[] {
  const allDecks = getDecksForArena(arenaId, allCards);
  return allDecks.filter((deck) => deck.cards.some((c) => c.name === cardName));
}

export function getAllArenaCardPairs(): { arenaSlug: string; cardSlug: string }[] {
  const pairs: { arenaSlug: string; cardSlug: string }[] = [];

  for (const arena of ARENAS) {
    const deckData = META_DECKS[arena.id] || FALLBACK_DECKS;
    const cardCounts = new Map<string, number>();
    for (const deck of deckData) {
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
