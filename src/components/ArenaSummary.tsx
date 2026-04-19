import { Deck } from "@/lib/data";
import { DECK_METADATA } from "@/lib/decks";

interface ArenaSummaryProps {
  arenaId: number;
  arenaName: string;
  trophies: number;
  decks: Deck[];
}

/** Pick 2-3 "feature cards" (highest elixir) to name a deck concisely. */
function featureCards(deck: Deck): string {
  const sorted = [...deck.cards].sort((a, b) => b.elixirCost - a.elixirCost);
  return sorted.slice(0, 3).map((c) => c.name).join(", ");
}

export function ArenaSummary({ arenaId, arenaName, trophies, decks }: ArenaSummaryProps) {
  if (decks.length === 0) return null;

  // Top 3 by win rate
  const top3 = [...decks]
    .filter((d) => d.winRate !== undefined)
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
    .slice(0, 3);

  if (top3.length === 0) return null;

  // Most-used cards across all decks in this arena
  const cardFreq = new Map<string, number>();
  for (const deck of decks) {
    for (const card of deck.cards) {
      cardFreq.set(card.name, (cardFreq.get(card.name) || 0) + 1);
    }
  }
  const topCards = [...cardFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  // Avg elixir across top 3
  const avgElixir =
    Math.round((top3.reduce((sum, d) => sum + d.avgElixir, 0) / top3.length) * 10) / 10;

  const updatedDate = DECK_METADATA?.lastUpdated
    ? new Date(DECK_METADATA.lastUpdated).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const ordinals = ["best", "second-best", "third-best"];

  return (
    <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold text-yellow-400 mb-2">
        Arena {arenaId} Meta Summary{updatedDate ? ` — ${updatedDate}` : ""}
      </h2>

      <div className="space-y-3 text-sm text-gray-300">
        <p>
          Based on {decks.length} proven decks in the {trophies}+ trophy range,
          the average deck costs {avgElixir} elixir.
          Here are the best performing decks for Arena {arenaId} ({arenaName}) right now:
        </p>

        <ol className="list-decimal list-inside space-y-2 ml-1">
          {top3.map((deck, i) => (
            <li key={i}>
              <span className="text-gray-300">
                The {ordinals[i]} deck features{" "}
                <strong className="text-white">{featureCards(deck)}</strong>
                {" and other cards, with a "}
                <strong className="text-green-400">
                  {(deck.winRate ?? 0).toFixed(1)}% win rate
                </strong>
                {deck.sampleSize != null && ` over ${deck.sampleSize} matches`}.
                {" "}Average elixir cost is {deck.avgElixir}.
              </span>
            </li>
          ))}
        </ol>

        <p>
          The current meta in Arena {arenaId} is shaped by popular cards
          like {topCards.slice(0, 3).join(", ")}
          {topCards.length > 3
            ? `, along with ${topCards.slice(3).join(" and ")}`
            : ""}
          .
        </p>
      </div>
    </div>
  );
}
