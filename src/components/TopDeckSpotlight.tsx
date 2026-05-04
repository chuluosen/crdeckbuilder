import { Deck } from "@/lib/data";
import { CopyDeckButton } from "./CopyDeckButton";

interface TopDeckSpotlightProps {
  deck: Deck;
  arenaId: number;
  arenaName: string;
}

function featureCards(deck: Deck): string {
  return [...deck.cards]
    .sort((a, b) => b.elixirCost - a.elixirCost)
    .slice(0, 3)
    .map((card) => card.name)
    .join(" + ");
}

export function TopDeckSpotlight({
  deck,
  arenaId,
  arenaName,
}: TopDeckSpotlightProps) {
  return (
    <section className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-3 sm:p-4 mb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-yellow-400">
            #1 Arena {arenaId} {arenaName} Deck
          </p>
          <h2 className="mt-1 text-xl font-bold text-white leading-tight">
            {featureCards(deck)} Deck
          </h2>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {deck.winRate !== undefined && (
              <span className="text-green-400">{deck.winRate}% Win</span>
            )}
            {deck.useRate !== undefined && (
              <span className="text-blue-400">{deck.useRate}% Use</span>
            )}
            {deck.sampleSize !== undefined && deck.sampleSize >= 10 && (
              <span className="text-gray-400">{deck.sampleSize} matches</span>
            )}
            <span className="text-gray-300">{deck.avgElixir} Elixir</span>
          </div>
        </div>

        <div className="w-full sm:w-56 sm:shrink-0">
          <CopyDeckButton cardIds={deck.cards.map((card) => card.id)} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {deck.cards.map((card) => (
          <div key={card.id} className="flex flex-col items-center min-w-0">
            <div className="h-14 w-12 overflow-hidden rounded bg-gray-700 sm:h-16 sm:w-14">
              {card.iconUrl && (
                <img
                  src={card.iconUrl}
                  alt={card.name}
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              )}
            </div>
            <span className="mt-1 max-w-full truncate text-xs text-gray-300">
              {card.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
