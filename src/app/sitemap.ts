import type { MetadataRoute } from "next";
import { execSync } from "node:child_process";
import { ARENAS, Card } from "@/lib/data";
import { getAllArenaCardPairs, getArenaIdsWithDecks, getHighArenaCardSlugs } from "@/lib/decks";
import cardsData from "@/lib/cards.json";

const BASE_URL = "https://crdeckbuilder.top";
const FALLBACK_LAST_MODIFIED = {
  home: "2026-02-23",
  arena: "2026-02-23",
  card: "2026-02-23",
} as const;

const HOME_DEPENDENCY_FILES = [
  "src/app/page.tsx",
  "src/lib/cards.json",
  "src/lib/starter-decks.json",
  "src/lib/generated-decks.json",
  "src/lib/data.ts",
  "src/lib/cards.ts",
  "src/lib/decks.ts",
];

const ARENA_DEPENDENCY_FILES = [
  "src/app/arena/[id]/page.tsx",
  "src/lib/cards.json",
  "src/lib/starter-decks.json",
  "src/lib/generated-decks.json",
  "src/lib/data.ts",
  "src/lib/cards.ts",
  "src/lib/decks.ts",
];

const CARD_DEPENDENCY_FILES = [
  "src/app/arena/[id]/[card]/page.tsx",
  "src/lib/cards.json",
  "src/lib/starter-decks.json",
  "src/lib/generated-decks.json",
  "src/lib/data.ts",
  "src/lib/cards.ts",
  "src/lib/decks.ts",
];

function getLastModifiedFromGit(
  dependencyFiles: string[],
  fallbackDate: string
): string {
  try {
    const quotedPaths = dependencyFiles
      .map((path) => `"${path.replace(/"/g, '\\"')}"`)
      .join(" ");
    const gitOutput = execSync(`git log -1 --format=%cs -- ${quotedPaths}`, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(gitOutput)) {
      return gitOutput;
    }
  } catch {
    // Build environments may not include git metadata.
  }

  return fallbackDate;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const allCards = cardsData as Card[];
  const arenaIdsWithDecks = new Set(getArenaIdsWithDecks(allCards));
  const homeLastModified = getLastModifiedFromGit(
    HOME_DEPENDENCY_FILES,
    FALLBACK_LAST_MODIFIED.home
  );
  const arenaLastModified = getLastModifiedFromGit(
    ARENA_DEPENDENCY_FILES,
    FALLBACK_LAST_MODIFIED.arena
  );
  const cardLastModified = getLastModifiedFromGit(
    CARD_DEPENDENCY_FILES,
    FALLBACK_LAST_MODIFIED.card
  );

  // Individual arena pages (1-11 only, 12-20 are consolidated)
  const arenaPages = ARENAS
    .filter((arena) => arenaIdsWithDecks.has(arena.id) && !arena.consolidated)
    .map((arena) => ({
      url: `${BASE_URL}/arena/${arena.slug}`,
      lastModified: arenaLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // High arenas consolidated page
  const highArenasPage = {
    url: `${BASE_URL}/arena/high-arenas`,
    lastModified: arenaLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  };

  // Card pages for non-consolidated arenas (1-11)
  const lowArenaCardPages = getAllArenaCardPairs()
    .filter((p) => {
      const arena = ARENAS.find((a) => a.slug === p.arenaSlug);
      return arena && !arena.consolidated;
    })
    .map((p) => ({
      url: `${BASE_URL}/arena/${p.arenaSlug}/${p.cardSlug}`,
      lastModified: cardLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Consolidated card pages for high arenas (12-20)
  const highArenaCardPages = getHighArenaCardSlugs().map((slug) => ({
    url: `${BASE_URL}/arena/high-arenas/${slug}`,
    lastModified: cardLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    highArenasPage,
    ...arenaPages,
    ...lowArenaCardPages,
    ...highArenaCardPages,
  ];
}
