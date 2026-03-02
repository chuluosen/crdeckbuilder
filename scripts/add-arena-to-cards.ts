import * as fs from "fs";
import * as path from "path";

// Fetch card arena unlock data from RoyaleAPI and add to our cards.json

interface RoyaleApiCard {
  id: number;
  name: string;
  arena: number;
}

interface OurCard {
  name: string;
  id: number;
  maxLevel: number;
  elixirCost: number;
  iconUrl: string;
  rarity: string;
  arena?: number;
}

async function main() {
  console.log("Fetching card data from RoyaleAPI...");
  const res = await fetch(
    "https://royaleapi.github.io/cr-api-data/json/cards.json"
  );
  if (!res.ok) {
    console.error(`Failed to fetch: ${res.status}`);
    process.exit(1);
  }
  const apiCards: RoyaleApiCard[] = await res.json();
  console.log(`Fetched ${apiCards.length} cards from RoyaleAPI`);

  // Build lookup maps: by ID and by normalized name
  const arenaById = new Map<number, number>();
  const arenaByName = new Map<string, number>();
  for (const c of apiCards) {
    arenaById.set(c.id, c.arena);
    arenaByName.set(c.name.toLowerCase(), c.arena);
  }

  // Load our cards.json
  const cardsPath = path.join(__dirname, "..", "src", "lib", "cards.json");
  const ourCards: OurCard[] = JSON.parse(fs.readFileSync(cardsPath, "utf-8"));

  let matched = 0;
  let unmatched = 0;

  for (const card of ourCards) {
    // Try match by ID first
    if (arenaById.has(card.id)) {
      card.arena = arenaById.get(card.id)!;
      matched++;
    } else {
      // Fallback: match by name (case-insensitive)
      const arena = arenaByName.get(card.name.toLowerCase());
      if (arena !== undefined) {
        card.arena = arena;
        matched++;
      } else {
        // Default: new/unrecognized cards go to arena 19 (conservative)
        console.warn(`  Unmatched: ${card.name} (id: ${card.id}) → defaulting to arena 19`);
        card.arena = 19;
        unmatched++;
      }
    }
  }

  fs.writeFileSync(cardsPath, JSON.stringify(ourCards, null, 2) + "\n", "utf-8");
  console.log(`\nDone! Matched: ${matched}, Unmatched (defaulted to 19): ${unmatched}`);
  console.log(`Updated ${cardsPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
