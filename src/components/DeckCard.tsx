import { Deck } from "@/lib/data";

export function DeckCard({ deck, index }: { deck: Deck; index: number }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-yellow-400">Deck #{index + 1}</span>
        <div className="flex gap-3 text-sm">
          {deck.winRate && (
            <span className="text-green-400">{deck.winRate}% Win</span>
          )}
          {deck.useRate && (
            <span className="text-blue-400">{deck.useRate}% Use</span>
          )}
          <span className="text-gray-400">Avg: {deck.avgElixir} Elixir</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {deck.cards.map((card) => (
          <div key={card.id} className="flex flex-col items-center">
            <div className="w-16 h-20 relative bg-gray-700 rounded overflow-hidden">
              {card.iconUrl && (
                <img
                  src={card.iconUrl}
                  alt={card.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              )}
            </div>
            <span className="text-xs text-gray-300 mt-1 text-center leading-tight">
              {card.name}
            </span>
            <span className="text-xs text-purple-400">{card.elixirCost}e</span>
          </div>
        ))}
      </div>
    </div>
  );
}
