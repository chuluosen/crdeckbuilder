import type { MetadataRoute } from "next";
import { ARENAS, Card } from "@/lib/data";
import { getAllArenaCardPairs, getArenaIdsWithDecks } from "@/lib/decks";
import cardsData from "@/lib/cards.json";

const BASE_URL = "https://crdeckbuilder.top";

export default function sitemap(): MetadataRoute.Sitemap {
  const allCards = cardsData as Card[];
  const arenaIdsWithDecks = new Set(getArenaIdsWithDecks(allCards));

  const arenaPages = ARENAS
    .filter((arena) => arenaIdsWithDecks.has(arena.id))
    .map((arena) => ({
      url: `${BASE_URL}/arena/${arena.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const cardPages = getAllArenaCardPairs().map((p) => ({
    url: `${BASE_URL}/arena/${p.arenaSlug}/${p.cardSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...arenaPages,
    ...cardPages,
  ];
}
