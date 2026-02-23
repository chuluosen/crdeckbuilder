import type { MetadataRoute } from "next";
import { ARENAS } from "@/lib/data";
import { getAllArenaCardPairs } from "@/lib/decks";

const BASE_URL = "https://crdeckbuilder.top";

export default function sitemap(): MetadataRoute.Sitemap {
  const arenaPages = ARENAS.map((arena) => ({
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
