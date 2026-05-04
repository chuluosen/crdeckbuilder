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

type SortOption = "winRate" | "useRate" | "sampleSize" | "elixirAsc" | "elixirDesc";
type SampleFilter = "all" | "10" | "25" | "50";
type ElixirFilter = "all" | "cycle" | "balanced" | "heavy";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "winRate", label: "Best win rate" },
  { value: "useRate", label: "Most used" },
  { value: "sampleSize", label: "Most matches" },
  { value: "elixirAsc", label: "Lowest elixir" },
  { value: "elixirDesc", label: "Highest elixir" },
];

const SAMPLE_FILTERS: { value: SampleFilter; label: string }[] = [
  { value: "all", label: "Any sample" },
  { value: "10", label: "10+ matches" },
  { value: "25", label: "25+ matches" },
  { value: "50", label: "50+ matches" },
];

const ELIXIR_FILTERS: { value: ElixirFilter; label: string }[] = [
  { value: "all", label: "Any cost" },
  { value: "cycle", label: "Fast cycle" },
  { value: "balanced", label: "Balanced" },
  { value: "heavy", label: "Heavy" },
];

function deckSignature(deck: Deck): string {
  return deck.cards.map((c) => c.name).join("|");
}

function compareByPerformance(a: Deck, b: Deck): number {
  return (
    (b.winRate ?? -1) - (a.winRate ?? -1) ||
    (b.sampleSize ?? 0) - (a.sampleSize ?? 0) ||
    (b.useRate ?? 0) - (a.useRate ?? 0) ||
    a.avgElixir - b.avgElixir ||
    deckSignature(a).localeCompare(deckSignature(b))
  );
}

function compareDecks(a: Deck, b: Deck, sortOption: SortOption): number {
  if (sortOption === "useRate") {
    return (b.useRate ?? -1) - (a.useRate ?? -1) || compareByPerformance(a, b);
  }

  if (sortOption === "sampleSize") {
    return (b.sampleSize ?? 0) - (a.sampleSize ?? 0) || compareByPerformance(a, b);
  }

  if (sortOption === "elixirAsc") {
    return a.avgElixir - b.avgElixir || compareByPerformance(a, b);
  }

  if (sortOption === "elixirDesc") {
    return b.avgElixir - a.avgElixir || compareByPerformance(a, b);
  }

  return compareByPerformance(a, b);
}

function matchesSampleFilter(deck: Deck, sampleFilter: SampleFilter): boolean {
  if (sampleFilter === "all") return true;
  return (deck.sampleSize ?? 0) >= Number(sampleFilter);
}

function matchesElixirFilter(deck: Deck, elixirFilter: ElixirFilter): boolean {
  if (elixirFilter === "cycle") return deck.avgElixir <= 3.3;
  if (elixirFilter === "balanced") return deck.avgElixir > 3.3 && deck.avgElixir <= 4.0;
  if (elixirFilter === "heavy") return deck.avgElixir > 4.0;
  return true;
}

function applyDeckControls(
  decks: Deck[],
  sortOption: SortOption,
  sampleFilter: SampleFilter,
  elixirFilter: ElixirFilter
): Deck[] {
  return [...decks]
    .filter((deck) => matchesSampleFilter(deck, sampleFilter))
    .filter((deck) => matchesElixirFilter(deck, elixirFilter))
    .sort((a, b) => compareDecks(a, b, sortOption));
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
  const [filterActive, setFilterActive] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("winRate");
  const [sampleFilter, setSampleFilter] = useState<SampleFilter>("all");
  const [elixirFilter, setElixirFilter] = useState<ElixirFilter>("all");
  const [ownedCardNames, setOwnedCardNames] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const names: string[] = JSON.parse(stored);
        setOwnedCardNames(new Set(names));
      }
    } catch {
      // Ignore unavailable or corrupted localStorage.
    }
    setMounted(true);
  }, []);

  const updateOwned = useCallback((next: Set<string>) => {
    setOwnedCardNames(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // Ignore quota and privacy-mode write failures.
    }
  }, []);

  const toggleCard = useCallback(
    (name: string) => {
      const next = new Set(ownedCardNames);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      setFilterActive(true);
      updateOwned(next);
    },
    [ownedCardNames, updateOwned]
  );

  const selectAll = useCallback(() => {
    const next = new Set(ownedCardNames);
    for (const c of availableCards.all) next.add(c.name);
    setFilterActive(true);
    updateOwned(next);
  }, [ownedCardNames, availableCards, updateOwned]);

  const deselectAll = useCallback(() => {
    const next = new Set(ownedCardNames);
    for (const c of availableCards.all) next.delete(c.name);
    setFilterActive(true);
    updateOwned(next);
  }, [ownedCardNames, availableCards, updateOwned]);

  const visibleDecks = useMemo(
    () => applyDeckControls(decks, sortOption, sampleFilter, elixirFilter),
    [decks, sortOption, sampleFilter, elixirFilter]
  );

  const categorized = useMemo(
    () => categorizeDecks(visibleDecks, ownedCardNames),
    [visibleDecks, ownedCardNames]
  );

  const ownedCount = availableCards.all.filter((c) =>
    ownedCardNames.has(c.name)
  ).length;
  const hasOwnedCardSelection = ownedCount > 0;
  const showOwnedMatches = filterActive && mounted && hasOwnedCardSelection;
  const hasDeckFilters = sampleFilter !== "all" || elixirFilter !== "all";
  const hasCustomDeckControls = sortOption !== "winRate" || hasDeckFilters;

  const resetDeckControls = useCallback(() => {
    setSortOption("winRate");
    setSampleFilter("all");
    setElixirFilter("all");
  }, []);

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

  const renderEmptyState = (message: string) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center mb-8">
      <p className="text-gray-400 text-lg mb-2">{message}</p>
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        {hasCustomDeckControls && (
          <button
            type="button"
            onClick={resetDeckControls}
            className="text-yellow-400 underline"
          >
            reset deck filters
          </button>
        )}
        {showOwnedMatches && (
          <button
            type="button"
            onClick={() => setFilterActive(false)}
            className="text-yellow-400 underline"
          >
            view all decks
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-gray-800 border border-gray-700 rounded-lg mb-6">
        <button
          type="button"
          onClick={() => {
            setExpanded(!expanded);
            if (!filterActive && !expanded) {
              setFilterActive(true);
            }
          }}
          className="w-full p-4 flex items-start justify-between gap-3 text-left hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="min-w-0">
            <span className="text-lg font-bold text-yellow-400">
              Filter by My Cards
            </span>
            {mounted && (
              <span className="mt-1 block text-sm text-gray-400">
                {ownedCount}/{availableCards.all.length} cards selected
                {" | "}
                {visibleDecks.length}/{decks.length} decks visible
                {showOwnedMatches &&
                  categorized.perfect.length > 0 &&
                  ` | ${categorized.perfect.length} deck${categorized.perfect.length !== 1 ? "s" : ""} you can build`}
              </span>
            )}
          </div>
          <span className="text-gray-400 text-xl leading-none">
            {expanded ? "v" : ">"}
          </span>
        </button>

        {expanded && mounted && (
          <div className="px-4 pb-4">
            <div className="border-t border-gray-700 pt-4 mb-4">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="block text-xs font-semibold uppercase text-gray-400">
                  Sort
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value as SortOption)}
                    className="mt-1 w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm normal-case text-white outline-none focus:border-yellow-400"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-semibold uppercase text-gray-400">
                  Matches
                  <select
                    value={sampleFilter}
                    onChange={(event) => setSampleFilter(event.target.value as SampleFilter)}
                    className="mt-1 w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm normal-case text-white outline-none focus:border-yellow-400"
                  >
                    {SAMPLE_FILTERS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-semibold uppercase text-gray-400">
                  Avg Elixir
                  <select
                    value={elixirFilter}
                    onChange={(event) => setElixirFilter(event.target.value as ElixirFilter)}
                    className="mt-1 w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-sm normal-case text-white outline-none focus:border-yellow-400"
                  >
                    {ELIXIR_FILTERS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                <span>
                  Showing {visibleDecks.length} of {decks.length} decks
                </span>
                {hasCustomDeckControls && (
                  <button
                    type="button"
                    onClick={resetDeckControls}
                    className="text-yellow-400 underline"
                  >
                    Reset controls
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm text-white"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
              >
                Deselect All
              </button>
              {filterActive && hasOwnedCardSelection && (
                <button
                  type="button"
                  onClick={() => setFilterActive(false)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-yellow-400 md:ml-auto"
                >
                  Show All Decks
                </button>
              )}
            </div>

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
                          type="button"
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

      {showOwnedMatches ? (
        <div>
          {categorized.perfect.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 text-green-400">
                Decks You Can Build ({categorized.perfect.length})
              </h2>
              <div className="space-y-4">
                {categorized.perfect.map((deck, i) => (
                  <DeckCard key={`perfect-${deckSignature(deck)}`} deck={deck} index={i} />
                ))}
              </div>
            </div>
          )}

          {categorized.missing1.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 text-yellow-400">
                Almost There - Missing 1 Card ({categorized.missing1.length})
              </h2>
              <div className="space-y-4">
                {categorized.missing1.map(({ deck, missing }, i) => (
                  <div key={`m1-${deckSignature(deck)}`}>
                    <DeckCard deck={deck} index={i} />
                    <p className="text-sm text-red-400 mt-1 ml-1">
                      Missing: {missing.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categorized.missing2.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 text-orange-400">
                Close - Missing 2 Cards ({categorized.missing2.length})
              </h2>
              <div className="space-y-4">
                {categorized.missing2.map(({ deck, missing }, i) => (
                  <div key={`m2-${deckSignature(deck)}`}>
                    <DeckCard deck={deck} index={i} />
                    <p className="text-sm text-red-400 mt-1 ml-1">
                      Missing: {missing.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categorized.perfect.length === 0 &&
            categorized.missing1.length === 0 &&
            categorized.missing2.length === 0 &&
            renderEmptyState("No matching decks found.")}
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {visibleDecks.length > 0
            ? visibleDecks.map((deck, i) => (
                <DeckCard key={deckSignature(deck)} deck={deck} index={i} />
              ))
            : renderEmptyState("No decks match these filters.")}
        </div>
      )}
    </div>
  );
}
