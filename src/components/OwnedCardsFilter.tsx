"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, Deck } from "@/lib/data";
import { DeckCard } from "./DeckCard";

const STORAGE_KEY = "ownedCards";

interface Props {
  allCards: Card[];
  decks: Deck[];
  arenaId: number;
}

interface CategorizedDecks {
  perfect: Deck[];
  missing1: { deck: Deck; missing: Card[] }[];
  missing2: { deck: Deck; missing: Card[] }[];
}

function categorizeDecks(
  decks: Deck[],
  ownedNames: Set<string>
): CategorizedDecks {
  const perfect: Deck[] = [];
  const missing1: { deck: Deck; missing: Card[] }[] = [];
  const missing2: { deck: Deck; missing: Card[] }[] = [];

  for (const deck of decks) {
    const missing = deck.cards.filter((c) => !ownedNames.has(c.name));
    if (missing.length === 0) {
      perfect.push(deck);
    } else if (missing.length === 1) {
      missing1.push({ deck, missing });
    } else if (missing.length === 2) {
      missing2.push({ deck, missing });
    }
  }

  return { perfect, missing1, missing2 };
}

export function OwnedCardsFilter({ allCards, decks, arenaId }: Props) {
  const [mounted, setMounted] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ownedCardNames, setOwnedCardNames] = useState<Set<string>>(new Set());

  // Cards available at this arena, grouped by rarity
  const availableCards = useMemo(() => {
    const cards = allCards
      .filter((c) => c.arena <= arenaId)
      .sort((a, b) => a.arena - b.arena || a.name.localeCompare(b.name));

    const grouped: Record<string, Card[]> = {};
    for (const card of cards) {
      const key = card.rarity;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(card);
    }
    return { all: cards, grouped };
  }, [allCards, arenaId]);

  // Load from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const names: string[] = JSON.parse(stored);
        setOwnedCardNames(new Set(names));
      }
    } catch {
      // localStorage unavailable or corrupted
    }
    setMounted(true);
  }, []);

  // Persist to localStorage
  const updateOwned = useCallback(
    (next: Set<string>) => {
      setOwnedCardNames(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // quota exceeded or unavailable
      }
    },
    []
  );

  const toggleCard = useCallback(
    (name: string) => {
      const next = new Set(ownedCardNames);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      updateOwned(next);
    },
    [ownedCardNames, updateOwned]
  );

  const selectAll = useCallback(() => {
    const next = new Set(ownedCardNames);
    for (const c of availableCards.all) next.add(c.name);
    updateOwned(next);
  }, [ownedCardNames, availableCards, updateOwned]);

  const deselectAll = useCallback(() => {
    const next = new Set(ownedCardNames);
    for (const c of availableCards.all) next.delete(c.name);
    updateOwned(next);
  }, [ownedCardNames, availableCards, updateOwned]);

  const categorized = useMemo(
    () => categorizeDecks(decks, ownedCardNames),
    [decks, ownedCardNames]
  );

  const ownedCount = availableCards.all.filter((c) =>
    ownedCardNames.has(c.name)
  ).length;

  const rarityOrder = ["common", "rare", "epic", "legendary", "champion"];
  const rarityLabel: Record<string, string> = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
    champion: "Champion",
  };
  const rarityColor: Record<string, string> = {
    common: "border-gray-500",
    rare: "border-orange-400",
    epic: "border-purple-500",
    legendary: "border-yellow-400",
    champion: "border-red-500",
  };

  return (
    <div>
      {/* Filter toggle panel */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg mb-6">
        <button
          onClick={() => {
            setExpanded(!expanded);
            if (!filterActive && !expanded) {
              // First time opening — activate filter
              setFilterActive(true);
            }
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-750 rounded-lg transition-colors"
        >
          <div>
            <span className="text-lg font-bold text-yellow-400">
              Filter by My Cards
            </span>
            {mounted && filterActive && (
              <span className="text-sm text-gray-400 ml-3">
                {ownedCount}/{availableCards.all.length} cards selected
                {categorized.perfect.length > 0 &&
                  ` · ${categorized.perfect.length} deck${categorized.perfect.length !== 1 ? "s" : ""} you can build`}
              </span>
            )}
          </div>
          <span className="text-gray-400 text-xl">
            {expanded ? "▲" : "▼"}
          </span>
        </button>

        {expanded && mounted && (
          <div className="px-4 pb-4">
            {/* Quick actions */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={selectAll}
                className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm text-white"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
              >
                Deselect All
              </button>
              {filterActive && (
                <button
                  onClick={() => setFilterActive(false)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-yellow-400 ml-auto"
                >
                  Show All Decks
                </button>
              )}
            </div>

            {/* Card grid grouped by rarity */}
            {rarityOrder
              .filter((r) => availableCards.grouped[r]?.length)
              .map((rarity) => (
                <div key={rarity} className="mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">
                    {rarityLabel[rarity] || rarity}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {availableCards.grouped[rarity].map((card) => {
                      const owned = ownedCardNames.has(card.name);
                      return (
                        <button
                          key={card.id}
                          onClick={() => toggleCard(card.name)}
                          title={card.name}
                          className={`w-12 h-14 rounded border-2 overflow-hidden transition-all ${
                            owned
                              ? `${rarityColor[rarity] || "border-gray-500"} opacity-100`
                              : "border-gray-700 opacity-40 grayscale"
                          }`}
                        >
                          {card.iconUrl && (
                            <img
                              src={card.iconUrl}
                              alt={card.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Deck list — filtered or full */}
      {filterActive && mounted ? (
        <div>
          {/* Perfect matches */}
          {categorized.perfect.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 text-green-400">
                Decks You Can Build ({categorized.perfect.length})
              </h2>
              <div className="space-y-4">
                {categorized.perfect.map((deck, i) => (
                  <DeckCard key={`perfect-${i}`} deck={deck} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Missing 1 card */}
          {categorized.missing1.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 text-yellow-400">
                Almost There — Missing 1 Card ({categorized.missing1.length})
              </h2>
              <div className="space-y-4">
                {categorized.missing1.map(({ deck, missing }, i) => (
                  <div key={`m1-${i}`}>
                    <DeckCard deck={deck} index={i} />
                    <p className="text-sm text-red-400 mt-1 ml-1">
                      Missing: {missing.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing 2 cards */}
          {categorized.missing2.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 text-orange-400">
                Close — Missing 2 Cards ({categorized.missing2.length})
              </h2>
              <div className="space-y-4">
                {categorized.missing2.map(({ deck, missing }, i) => (
                  <div key={`m2-${i}`}>
                    <DeckCard deck={deck} index={i} />
                    <p className="text-sm text-red-400 mt-1 ml-1">
                      Missing: {missing.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {categorized.perfect.length === 0 &&
            categorized.missing1.length === 0 &&
            categorized.missing2.length === 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center mb-8">
                <p className="text-gray-400 text-lg mb-2">
                  No matching decks found.
                </p>
                <p className="text-gray-500 text-sm">
                  Try selecting more cards you own, or{" "}
                  <button
                    onClick={() => setFilterActive(false)}
                    className="text-yellow-400 underline"
                  >
                    view all decks
                  </button>{" "}
                  for this arena.
                </p>
              </div>
            )}
        </div>
      ) : (
        // Default: show all decks (matches SSR output exactly)
        <div className="space-y-4 mb-8">
          {decks.map((deck, i) => (
            <DeckCard key={i} deck={deck} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
