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

interface ReplacementSuggestion {
  card: Card;
  reason: string;
  selected: boolean;
}

interface ReplacementContext {
  arenaId: number;
  availableCards: Card[];
  ownedNames: Set<string>;
  cardFrequency: Map<string, number>;
}

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

const CARD_ROLE_TAGS: Record<string, string[]> = {
  Giant: ["win-condition", "tank-win"],
  Balloon: ["win-condition", "air-beatdown", "air-pressure"],
  Golem: ["win-condition", "tank-win"],
  "Hog Rider": ["win-condition", "pressure-win"],
  "Royal Giant": ["win-condition", "tank-win"],
  "Lava Hound": ["win-condition", "air-beatdown", "tank-win"],
  Miner: ["win-condition", "control-win"],
  "Goblin Barrel": ["win-condition", "bait"],
  Graveyard: ["win-condition", "control-win"],
  "Battle Ram": ["win-condition", "pressure-win"],
  "Ram Rider": ["win-condition", "pressure-win", "control-win"],
  "Wall Breakers": ["win-condition", "pressure-win"],
  "Royal Hogs": ["win-condition", "pressure-win"],
  "Goblin Giant": ["win-condition", "tank-win"],
  "Goblin Drill": ["win-condition", "control-win", "bait"],
  "Electro Giant": ["win-condition", "tank-win"],
  Mortar: ["win-condition", "building", "siege", "siege-building"],
  "X-Bow": ["win-condition", "building", "siege", "siege-building"],
  "Skeleton Barrel": ["win-condition", "bait"],
  "Elixir Golem": ["win-condition", "tank-win"],
  "Three Musketeers": ["win-condition", "support-push"],
  "Rune Giant": ["win-condition", "tank-win"],

  Cannon: ["building", "defense-building"],
  Tesla: ["building", "defense-building", "air-defense"],
  "Inferno Tower": ["building", "defense-building", "tank-killer"],
  "Bomb Tower": ["building", "defense-building", "splash-defense"],
  Tombstone: ["building", "defense-building", "swarm-defense"],
  "Goblin Cage": ["building", "defense-building"],
  "Goblin Hut": ["building", "spawner-building"],
  Furnace: ["building", "spawner-building"],
  "Barbarian Hut": ["building", "spawner-building"],
  "Elixir Collector": ["building", "economy-building"],

  Fireball: ["spell", "damage-spell", "medium-spell", "splash"],
  Poison: ["spell", "damage-spell", "medium-spell", "control"],
  Freeze: ["spell", "control-spell", "medium-spell", "control"],
  Lightning: ["spell", "damage-spell", "heavy-spell", "tank-killer"],
  Rocket: ["spell", "damage-spell", "heavy-spell", "tank-killer"],
  Arrows: ["spell", "swarm-clear-spell", "small-spell", "splash"],
  Zap: ["spell", "reset-spell", "small-spell", "reset"],
  "The Log": ["spell", "swarm-clear-spell", "small-spell"],
  "Barbarian Barrel": ["spell", "swarm-clear-spell", "small-spell", "bait"],
  "Giant Snowball": ["spell", "control-spell", "small-spell", "control"],
  "Royal Delivery": ["spell", "swarm-clear-spell", "medium-spell", "splash"],
  Earthquake: ["spell", "building-breaker", "medium-spell", "control"],
  Tornado: ["spell", "control-spell", "medium-spell", "control"],
  Rage: ["spell", "support-spell", "small-spell", "support"],
  Clone: ["spell", "support-spell", "medium-spell", "support"],
  Mirror: ["spell", "support-spell", "support"],
  "Goblin Curse": ["spell", "support-spell", "small-spell", "support"],
  Void: ["spell", "damage-spell", "medium-spell", "tank-killer"],
  Vines: ["spell", "control-spell", "medium-spell", "control"],

  Knight: ["melee-defense", "mini-tank"],
  Valkyrie: ["melee-defense", "splash", "mini-tank"],
  "Mini P.E.K.K.A": ["melee-defense", "tank-killer"],
  "Mega Knight": ["melee-defense", "splash", "tank"],
  "Dark Prince": ["melee-defense", "splash", "fast-pressure"],
  Prince: ["melee-defense", "fast-pressure"],
  "Golden Knight": ["melee-defense", "fast-pressure"],
  Monk: ["melee-defense", "tank"],
  "Mighty Miner": ["melee-defense", "tank-killer"],
  "Skeleton King": ["melee-defense", "swarm"],
  "Ice Golem": ["melee-defense", "cycle"],
  "Royal Ghost": ["melee-defense", "splash"],
  Bandit: ["melee-defense", "fast-pressure"],
  "Giant Skeleton": ["melee-defense", "tank", "splash"],
  "P.E.K.K.A": ["melee-defense", "tank-killer", "tank"],
  Lumberjack: ["melee-defense", "fast-pressure", "support"],
  Fisherman: ["melee-defense", "control"],
  "Boss Bandit": ["melee-defense", "fast-pressure"],
  Berserker: ["melee-defense", "cycle"],

  Musketeer: ["ranged-support", "air-defense"],
  Archers: ["ranged-support", "air-defense"],
  "Spear Goblins": ["ranged-support", "air-defense", "cycle"],
  "Dart Goblin": ["ranged-support", "air-defense", "bait"],
  Firecracker: ["ranged-support", "air-defense", "splash"],
  Wizard: ["ranged-support", "air-defense", "splash"],
  "Magic Archer": ["ranged-support", "air-defense", "control"],
  "Little Prince": ["ranged-support", "air-defense"],
  "Archer Queen": ["ranged-support", "air-defense"],
  Hunter: ["ranged-support", "air-defense", "tank-killer"],
  Executioner: ["ranged-support", "air-defense", "splash"],
  Bowler: ["ranged-support", "splash", "control"],
  "Cannon Cart": ["ranged-support", "defense"],
  Princess: ["ranged-support", "splash", "bait"],
  "Mother Witch": ["ranged-support", "splash"],
  "Goblin Demolisher": ["ranged-support", "splash"],

  Minions: ["air-support", "air-defense", "swarm"],
  "Minion Horde": ["air-support", "air-defense", "swarm"],
  Bats: ["air-support", "air-defense", "cycle"],
  "Mega Minion": ["air-support", "air-defense"],
  "Baby Dragon": ["air-support", "air-defense", "splash"],
  "Inferno Dragon": ["air-support", "air-defense", "tank-killer"],
  "Electro Dragon": ["air-support", "air-defense", "reset"],
  Phoenix: ["air-support", "air-defense"],
  "Flying Machine": ["air-support", "air-defense", "ranged-support"],
  "Skeleton Dragons": ["air-support", "air-defense", "splash"],
  "Spirit Empress": ["air-support", "air-defense"],

  Skeletons: ["cycle", "swarm"],
  Goblins: ["cycle", "swarm"],
  "Ice Spirit": ["cycle", "reset"],
  "Fire Spirit": ["cycle", "splash"],
  "Electro Spirit": ["cycle", "reset"],
  "Heal Spirit": ["cycle", "support"],
  Bomber: ["cycle", "splash"],
  "Suspicious Bush": ["cycle", "bait"],
  Guards: ["swarm", "melee-defense"],
  "Skeleton Army": ["swarm", "tank-killer"],
  Barbarians: ["swarm", "melee-defense"],
  "Elite Barbarians": ["melee-defense", "fast-pressure"],
  "Goblin Gang": ["swarm", "bait"],
  "Royal Recruits": ["swarm", "melee-defense"],
  Rascals: ["swarm", "ranged-support"],
  Witch: ["ranged-support", "splash", "swarm"],
  "Night Witch": ["melee-defense", "swarm"],
  Zappies: ["ranged-support", "reset"],
  "Goblin Machine": ["ranged-support", "tank"],
  Goblinstein: ["melee-defense", "tank"],
};

const ROLE_LABELS: Record<string, string> = {
  "win-condition": "win condition",
  "pressure-win": "pressure",
  "tank-win": "tank",
  "air-beatdown": "air beatdown",
  "control-win": "control",
  tank: "tank",
  "air-pressure": "air pressure",
  "fast-pressure": "pressure",
  "support-push": "support push",
  siege: "siege",
  control: "control",
  bait: "bait",
  building: "building",
  defense: "defense",
  "air-defense": "air defense",
  "defense-building": "defense building",
  "spawner-building": "spawner",
  "economy-building": "economy building",
  "siege-building": "siege building",
  "tank-killer": "tank killer",
  spawner: "spawner",
  support: "support",
  spell: "spell",
  "small-spell": "small spell",
  "medium-spell": "spell",
  "heavy-spell": "heavy spell",
  "damage-spell": "damage spell",
  "control-spell": "control spell",
  "reset-spell": "reset spell",
  "swarm-clear-spell": "swarm-clear spell",
  "support-spell": "support spell",
  splash: "splash",
  reset: "reset",
  "building-breaker": "building breaker",
  "melee-defense": "defender",
  "mini-tank": "mini tank",
  "ranged-support": "ranged support",
  "air-support": "air support",
  cycle: "cycle",
  swarm: "swarm",
};

const PRIMARY_ROLE_PRIORITY = [
  "damage-spell",
  "control-spell",
  "reset-spell",
  "swarm-clear-spell",
  "building-breaker",
  "support-spell",
  "air-beatdown",
  "pressure-win",
  "tank-win",
  "control-win",
  "bait",
  "siege",
  "support-push",
  "defense-building",
  "spawner-building",
  "economy-building",
  "siege-building",
  "heavy-spell",
  "medium-spell",
  "small-spell",
] as const;

const SPELL_ROLE_TAGS = new Set<string>([
  "damage-spell",
  "control-spell",
  "reset-spell",
  "swarm-clear-spell",
  "building-breaker",
  "support-spell",
  "heavy-spell",
  "medium-spell",
  "small-spell",
]);
const WIN_CONDITION_ROLE_TAGS = new Set<string>([
  "pressure-win",
  "tank-win",
  "air-beatdown",
  "control-win",
  "bait",
  "siege",
  "support-push",
]);
const BUILDING_ROLE_TAGS = new Set<string>([
  "defense-building",
  "spawner-building",
  "economy-building",
  "siege-building",
]);

function deckSignature(deck: Deck): string {
  return deck.cards.map((c) => c.name).join("|");
}

function getPrimaryRoleTag(tags: string[]): string | undefined {
  return PRIMARY_ROLE_PRIORITY.find((tag) => tags.includes(tag));
}

function getRoleFamilyTags(tags: string[], family: Set<string>): string[] {
  return tags.filter((tag) => family.has(tag));
}

function getSpellRoleTags(tags: string[]): string[] {
  return tags.filter((tag) => SPELL_ROLE_TAGS.has(tag));
}

function getCardTags(card: Card): string[] {
  const explicitTags = CARD_ROLE_TAGS[card.name];
  if (explicitTags) return explicitTags;

  const tags: string[] = [];
  if (card.id >= 27000000 && card.id < 28000000) {
    tags.push("building", "defense");
  } else if (card.id >= 28000000) {
    tags.push("spell");
    if (card.elixirCost <= 2) tags.push("small-spell");
    else if (card.elixirCost >= 5) tags.push("heavy-spell");
    else tags.push("medium-spell");
  } else {
    tags.push("support");
    if (card.elixirCost <= 2) tags.push("cycle");
    if (card.elixirCost >= 6) tags.push("tank");
  }

  return tags;
}

function sharedTags(a: string[], b: string[]): string[] {
  return a.filter((tag) => b.includes(tag));
}

function isRoleCompatible(missingTags: string[], candidateTags: string[]): boolean {
  if (missingTags.includes("win-condition")) {
    const missingFamilies = getRoleFamilyTags(missingTags, WIN_CONDITION_ROLE_TAGS);
    const candidateFamilies = getRoleFamilyTags(candidateTags, WIN_CONDITION_ROLE_TAGS);

    if (missingFamilies.length > 0 && candidateFamilies.length > 0) {
      return missingFamilies.some((family) => candidateFamilies.includes(family));
    }

    return candidateTags.includes("win-condition");
  }

  if (missingTags.includes("building")) {
    const missingFamilies = getRoleFamilyTags(missingTags, BUILDING_ROLE_TAGS);
    const candidateFamilies = getRoleFamilyTags(candidateTags, BUILDING_ROLE_TAGS);

    if (missingFamilies.length > 0 && candidateFamilies.length > 0) {
      return missingFamilies.some((family) => candidateFamilies.includes(family));
    }

    return candidateTags.includes("building");
  }

  if (missingTags.includes("spell")) {
    const missingSpellRoles = getSpellRoleTags(missingTags);
    const candidateSpellRoles = getSpellRoleTags(candidateTags);

    if (missingSpellRoles.length === 0 || candidateSpellRoles.length === 0) {
      return candidateTags.includes("spell") && missingTags.includes("spell");
    }

    return missingSpellRoles.some((role) => candidateSpellRoles.includes(role));
  }

  return sharedTags(missingTags, candidateTags).length > 0;
}

function formatElixirDifference(missing: Card, candidate: Card): string {
  const diff = candidate.elixirCost - missing.elixirCost;
  if (diff === 0) return "same elixir";
  return `${Math.abs(diff)} elixir ${diff > 0 ? "higher" : "lower"}`;
}

function buildReplacementReason(
  missingCard: Card,
  candidate: Card,
  candidateTags: string[],
  missingTags: string[],
  selected: boolean,
  frequency: number
): string {
  const overlap = sharedTags(missingTags, candidateTags);
  const roleTag =
    getPrimaryRoleTag(overlap) ??
    getPrimaryRoleTag(candidateTags) ??
    getPrimaryRoleTag(missingTags);
  const role = ROLE_LABELS[roleTag ?? ""] ?? "similar";
  const parts = [`same ${role} role`, formatElixirDifference(missingCard, candidate)];

  if (selected) {
    parts.push("selected");
  } else {
    parts.push("arena available");
  }

  if (frequency > 0) {
    parts.push(`seen in ${frequency} listed deck${frequency !== 1 ? "s" : ""}`);
  }

  return parts.join(", ");
}

function getReplacementSuggestions(
  missingCard: Card,
  deck: Deck,
  context: ReplacementContext
): ReplacementSuggestion[] {
  const deckCardNames = new Set(deck.cards.map((card) => card.name));
  const missingTags = getCardTags(missingCard);

  const scored = context.availableCards
    .filter((candidate) => !deckCardNames.has(candidate.name))
    .map((candidate) => {
      const candidateTags = getCardTags(candidate);
      const overlap = sharedTags(missingTags, candidateTags);
      const compatible = isRoleCompatible(missingTags, candidateTags);
      const elixirDiff = Math.abs(candidate.elixirCost - missingCard.elixirCost);
      const selected = context.ownedNames.has(candidate.name);
      const frequency = context.cardFrequency.get(candidate.name) ?? 0;
      const missingPrimaryRole = getPrimaryRoleTag(missingTags);
      const candidatePrimaryRole = getPrimaryRoleTag(candidateTags);

      if (!compatible || elixirDiff > 3) {
        return null;
      }

      let score = 0;
      score += selected ? 80 : 0;
      score +=
        missingPrimaryRole && candidatePrimaryRole && candidatePrimaryRole === missingPrimaryRole
          ? 35
          : 0;
      score += overlap.length * 24;
      score += Math.max(0, 30 - elixirDiff * 10);
      score += Math.min(20, frequency * 2);
      score += candidate.rarity === missingCard.rarity ? 3 : 0;

      return {
        card: candidate,
        reason: buildReplacementReason(
          missingCard,
          candidate,
          candidateTags,
          missingTags,
          selected,
          frequency
        ),
        selected,
        score,
      };
    })
    .filter(
      (
        suggestion
      ): suggestion is ReplacementSuggestion & { score: number } =>
        suggestion !== null
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.card.elixirCost - b.card.elixirCost ||
        a.card.name.localeCompare(b.card.name)
    );

  return scored.slice(0, 2).map(({ score: _score, ...suggestion }) => suggestion);
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

  const replacementContext = useMemo<ReplacementContext>(() => {
    const cardFrequency = new Map<string, number>();
    for (const deck of decks) {
      for (const card of deck.cards) {
        cardFrequency.set(card.name, (cardFrequency.get(card.name) ?? 0) + 1);
      }
    }

    return {
      arenaId,
      availableCards: availableCards.all,
      ownedNames: ownedCardNames,
      cardFrequency,
    };
  }, [arenaId, availableCards.all, decks, ownedCardNames]);

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

  const renderReplacementIdeas = (deck: Deck, missing: Card[]) => (
    <div className="mt-2 rounded border border-yellow-500/30 bg-gray-900 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase text-yellow-400">
          Replacement Ideas
        </span>
        <span className="text-xs text-gray-500">Arena {replacementContext.arenaId} legal</span>
      </div>
      <div className="space-y-3">
        {missing.map((missingCard) => {
          const suggestions = getReplacementSuggestions(
            missingCard,
            deck,
            replacementContext
          );

          return (
            <div key={`${deckSignature(deck)}-${missingCard.id}`} className="min-w-0">
              <p className="mb-2 text-sm text-red-300">
                Missing: <span className="font-semibold">{missingCard.name}</span>
              </p>
              {suggestions.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <div
                      key={`${missingCard.id}-${suggestion.card.id}`}
                      className="flex gap-2 rounded border border-gray-700 bg-gray-950/60 p-2"
                    >
                      <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-gray-800">
                        {suggestion.card.iconUrl && (
                          <img
                            src={suggestion.card.iconUrl}
                            alt={suggestion.card.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-100">
                            {suggestion.card.name}
                          </span>
                          <span className="text-xs text-purple-300">
                            {suggestion.card.elixirCost}e
                          </span>
                          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                            {suggestion.selected ? "selected" : "available"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-snug text-gray-400">
                          {suggestion.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No close same-role replacement found from the cards available here.
                </p>
              )}
            </div>
          );
        })}
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
                    {renderReplacementIdeas(deck, missing)}
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
                    {renderReplacementIdeas(deck, missing)}
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
