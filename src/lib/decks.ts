import { Card, Deck, ARENAS } from "./data";
import { cardNameToSlug, HOT_CARDS } from "./cards";
import generatedDecks from "./generated-decks.json";
import starterDecks from "./starter-decks.json";
import cardsJson from "./cards.json";

interface DeckMetadata {
  lastUpdated: string;
  totalBattles: number;
  totalPlayers: number;
  regions: number;
  bayesianM: number;
}

interface GeneratedDecksData {
  metadata: DeckMetadata;
  decks: {
    cards: string[];
    winRate: number;
    useRate: number;
    sampleSize: number;
    firstAvailableArena: number;
  }[];
}

type DeckEntry = {
  cards: string[];
  winRate: number;
  useRate: number;
  sampleSize?: number;
  firstAvailableArena?: number;
};

const GENERATED_DATA = generatedDecks as unknown as GeneratedDecksData;
export const DECK_METADATA = GENERATED_DATA.metadata;

// Valid card names from cards.json for validation
const validCardNames = new Set<string>(
  (cardsJson as { name: string }[]).map((c) => c.name)
);

// Card arena lookup from cards.json (name → arena)
const cardArenaMap = new Map<string, number>(
  (cardsJson as { name: string; arena: number }[]).map((c) => [c.name, c.arena])
);

// Flatten generated decks and starter decks into a single pool, deduplicate
function dedupeDecks(decks: DeckEntry[]): DeckEntry[] {
  const seen = new Set<string>();
  return decks.filter((d) => {
    const key = [...d.cards].sort().join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const ALL_DECKS: DeckEntry[] = dedupeDecks(
  ([...GENERATED_DATA.decks, ...(starterDecks as DeckEntry[])] as DeckEntry[])
    .filter((d) => d.cards.every((name) => validCardNames.has(name)))
);

export function getDecksForArena(arenaId: number, allCards: Card[]): Deck[] {
  const cardMap = new Map(allCards.map((c) => [c.name, c]));

  return ALL_DECKS
    .filter((d) => {
      // Filter by firstAvailableArena if available, otherwise check all cards
      if (d.firstAvailableArena !== undefined) {
        return d.firstAvailableArena <= arenaId;
      }
      // Fallback for starter decks without firstAvailableArena
      return d.cards.every((name) => {
        const arena = cardArenaMap.get(name);
        return arena !== undefined && arena <= arenaId;
      });
    })
    .map((d) => {
      const cards = d.cards
        .map((name) => cardMap.get(name))
        .filter((c): c is Card => c !== undefined);
      const avgElixir =
        cards.length > 0
          ? Math.round((cards.reduce((sum, c) => sum + c.elixirCost, 0) / cards.length) * 10) / 10
          : 0;
      return {
        cards,
        avgElixir,
        winRate: d.winRate,
        useRate: d.useRate,
        sampleSize: d.sampleSize,
      };
    })
    .filter((deck) => deck.cards.length === 8);
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

// Get all decks for a given card across all high arenas (12-20)
export function getDecksForHighArenasCard(cardName: string, allCards: Card[]): Deck[] {
  // Arena 12 is the lowest high arena — getting decks for arena 12 includes all decks
  // available at that level, and higher arenas are a superset
  const allDecks = getDecksForArena(20, allCards);
  return allDecks.filter((deck) => deck.cards.some((c) => c.name === cardName));
}

// Get unique card slugs that appear across high arenas (12-20)
export function getHighArenaCardSlugs(): string[] {
  const highArenas = ARENAS.filter((a) => a.consolidated);
  const cardSlugs = new Set<string>();

  for (const arena of highArenas) {
    const cardCounts = new Map<string, number>();
    for (const deck of ALL_DECKS) {
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
        cardSlugs.add(cardNameToSlug(cardName));
      }
    }
  }

  return Array.from(cardSlugs);
}

export function getArenaIdsWithDecks(allCards: Card[]): number[] {
  return ARENAS
    .filter((arena) => getDecksForArena(arena.id, allCards).length > 0)
    .map((arena) => arena.id);
}
