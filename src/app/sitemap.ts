import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import { ARENAS, Card } from "@/lib/data";
import { getAllArenaCardPairs, getArenaIdsWithDecks } from "@/lib/decks";
import cardsData from "@/lib/cards.json";

const BASE_URL = "https://crdeckbuilder.top";
const FALLBACK_LAST_MODIFIED = "2026-01-01T00:00:00.000Z";

// Keep <lastmod> tied to files that actually affect page content.
const CONTENT_DEPENDENCY_FILES = [
  "src/lib/cards.json",
  "src/lib/starter-decks.json",
  "src/lib/generated-decks.json",
  "src/lib/data.ts",
  "src/lib/cards.ts",
  "src/lib/decks.ts",
  "src/app/page.tsx",
  "src/app/arena/[id]/page.tsx",
  "src/app/arena/[id]/[card]/page.tsx",
];

function getContentLastModified(): Date {
  let latestModifiedMs = 0;

  for (const relativePath of CONTENT_DEPENDENCY_FILES) {
    try {
      const filePath = join(process.cwd(), relativePath);
      const { mtimeMs } = statSync(filePath);
      if (mtimeMs > latestModifiedMs) {
        latestModifiedMs = mtimeMs;
      }
    } catch {
      // Ignore missing files and fall back to a fixed date.
    }
  }

  return latestModifiedMs > 0
    ? new Date(latestModifiedMs)
    : new Date(FALLBACK_LAST_MODIFIED);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const allCards = cardsData as Card[];
  const arenaIdsWithDecks = new Set(getArenaIdsWithDecks(allCards));
  const lastModified = getContentLastModified();

  const arenaPages = ARENAS
    .filter((arena) => arenaIdsWithDecks.has(arena.id))
    .map((arena) => ({
      url: `${BASE_URL}/arena/${arena.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const cardPages = getAllArenaCardPairs().map((p) => ({
    url: `${BASE_URL}/arena/${p.arenaSlug}/${p.cardSlug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...arenaPages,
    ...cardPages,
  ];
}
