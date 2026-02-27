import * as fs from "fs";
import * as path from "path";

// ── Load .env ───────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2]?.replace(/^["']|["']$/g, "") ?? "";
    }
  }
}

// ── Config ──────────────────────────────────────────────────────────────────
const API_KEY = process.env.CLASH_ROYALE_API_KEY ?? "";
const BASE_URL = "https://api.clashroyale.com/v1";
const REQUEST_DELAY_MS = 200;
const MIN_DECK_COUNT = 5;
const DECKS_PER_ARENA = 45;
const TOP_PLAYERS_PER_REGION = 50;
const BAYESIAN_M = 20; // Bayesian average: credibility threshold
const USE_RATE_WEIGHT = 0.3; // Weight for use rate in final ranking score

const HOT_CARDS = [
  "Hog Rider", "P.E.K.K.A", "Giant", "Balloon", "Golem",
  "Lava Hound", "Goblin Barrel", "Miner", "Royal Giant", "X-Bow",
  "Mega Knight", "Sparky", "Electro Giant", "Valkyrie",
];

const LOCATION_IDS = [
  57000000, // International
  57000249, // United States
  57000056, // China
  57000109, // Japan
  57000094, // Germany
  57000077, // France
  57000034, // Brazil
  57000124, // South Korea
  57000207, // Turkey
  57000183, // Russia
];

// ── Types ───────────────────────────────────────────────────────────────────
interface DeckStat {
  cards: string[];
  wins: number;
  losses: number;
  total: number;
}

interface OutputDeck {
  cards: string[];
  winRate: number;
  useRate: number;
}

interface OutputData {
  [arenaId: string]: OutputDeck[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function apiFetch<T>(endpoint: string, retries = 3): Promise<T | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      if (res.status === 429) {
        const wait = REQUEST_DELAY_MS * Math.pow(2, attempt + 1);
        console.warn(`  Rate limited, waiting ${wait}ms...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) {
        console.warn(`  API ${res.status} for ${endpoint}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (e) {
      console.warn(`  Fetch error for ${endpoint}:`, (e as Error).message);
      if (attempt < retries - 1) await sleep(REQUEST_DELAY_MS * Math.pow(2, attempt));
    }
  }
  return null;
}

function deckKey(cardNames: string[]): string {
  return [...cardNames].sort().join("|");
}

// ── Fetch top players from a region ─────────────────────────────────────────
interface RankingPlayer {
  tag: string;
  name: string;
}

async function fetchTopPlayers(locationId: number): Promise<string[]> {
  const data = await apiFetch<{ items: RankingPlayer[] }>(
    `/locations/${locationId}/pathoflegend/players?limit=${TOP_PLAYERS_PER_REGION}`
  );
  if (!data?.items) return [];
  return data.items.map((p) => p.tag);
}

// ── Fetch battle log for a player ───────────────────────────────────────────
interface BattleCard {
  name: string;
  id: number;
  level: number;
  maxLevel: number;
}

interface BattleParticipant {
  tag: string;
  crowns: number;
  cards: BattleCard[];
}

interface Battle {
  type: string;
  team: BattleParticipant[];
  opponent: BattleParticipant[];
}

async function fetchBattleLog(playerTag: string): Promise<Battle[]> {
  const encoded = encodeURIComponent(playerTag);
  const data = await apiFetch<Battle[]>(`/players/${encoded}/battlelog`);
  return data ?? [];
}

// ── Aggregate deck stats from battles ───────────────────────────────────────
function aggregateDecks(allBattles: Battle[]): Map<string, DeckStat> {
  const deckMap = new Map<string, DeckStat>();
  const pvpTypes = ["PvP", "pathOfLegend", "CW_Battle_1v1"];

  for (const battle of allBattles) {
    if (!pvpTypes.some((t) => battle.type?.includes(t))) continue;
    if (!battle.team?.[0] || !battle.opponent?.[0]) continue;

    const teamCards = battle.team[0].cards.map((c) => c.name);
    const oppCards = battle.opponent[0].cards.map((c) => c.name);
    if (teamCards.length !== 8 || oppCards.length !== 8) continue;

    const teamCrowns = battle.team[0].crowns;
    const oppCrowns = battle.opponent[0].crowns;
    const teamWon = teamCrowns > oppCrowns;
    const isDraw = teamCrowns === oppCrowns;

    if (isDraw) continue;

    // Record team's deck
    const tKey = deckKey(teamCards);
    const tEntry = deckMap.get(tKey) ?? { cards: [...teamCards].sort(), wins: 0, losses: 0, total: 0 };
    tEntry.total++;
    if (teamWon) tEntry.wins++; else tEntry.losses++;
    deckMap.set(tKey, tEntry);

    // Record opponent's deck (doubles data)
    const oKey = deckKey(oppCards);
    const oEntry = deckMap.get(oKey) ?? { cards: [...oppCards].sort(), wins: 0, losses: 0, total: 0 };
    oEntry.total++;
    if (!teamWon) oEntry.wins++; else oEntry.losses++;
    deckMap.set(oKey, oEntry);
  }

  return deckMap;
}

// ── Assign decks to arenas and ensure HOT_CARDS coverage ────────────────────
function assignDecksToArenas(deckMap: Map<string, DeckStat>): OutputData {
  const allStats = Array.from(deckMap.values());
  const totalGames = allStats.reduce((s, d) => s + d.total, 0);

  // Global average win rate (C in Bayesian formula)
  const globalWinRate = allStats.reduce((s, d) => s + d.wins, 0) / totalGames;

  // Filter and score with Bayesian Average: score = (v/(v+m))*R + (m/(v+m))*C
  const qualified = allStats
    .filter((d) => d.total >= MIN_DECK_COUNT)
    .map((d) => {
      const v = d.total;
      const R = d.wins / d.total;
      const bayesianScore = (v / (v + BAYESIAN_M)) * R + (BAYESIAN_M / (v + BAYESIAN_M)) * globalWinRate;
      const rawUseRate = Math.round((d.total / totalGames) * 1000) / 10;
      return {
        cards: d.cards,
        winRate: Math.round(bayesianScore * 100),
        useRate: Math.max(0.1, rawUseRate),
        _bayesianScore: bayesianScore,
        _rawUseRate: d.total / totalGames,
      };
    });

  if (qualified.length === 0) {
    console.error("No qualified decks found!");
    process.exit(1);
  }

  // Normalize use rate to [0, 1] for ranking
  const maxUseRate = Math.max(...qualified.map((d) => d._rawUseRate));

  // Final ranking: combine Bayesian win rate and normalized use rate
  const ranked = qualified
    .map((d) => ({
      ...d,
      _finalScore: (1 - USE_RATE_WEIGHT) * d._bayesianScore + USE_RATE_WEIGHT * (d._rawUseRate / maxUseRate),
    }))
    .sort((a, b) => b._finalScore - a._finalScore);

  console.log(`Global average win rate: ${(globalWinRate * 100).toFixed(1)}%`);

  // Take top decks
  let pool = ranked.slice(0, DECKS_PER_ARENA);

  // Ensure each HOT_CARD has at least 3 decks
  for (const hotCard of HOT_CARDS) {
    const count = pool.filter((d) => d.cards.includes(hotCard)).length;
    if (count < 3) {
      const extras = ranked
        .filter((d) => d.cards.includes(hotCard) && !pool.includes(d))
        .slice(0, 3 - count);
      pool.push(...extras);
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  pool = pool.filter((d) => {
    const k = deckKey(d.cards);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // Assign same pool to all 20 arenas
  const output: OutputData = {};
  for (let arenaId = 1; arenaId <= 20; arenaId++) {
    output[arenaId] = pool.map((d) => ({
      cards: d.cards,
      winRate: d.winRate,
      useRate: d.useRate,
    }));
  }

  return output;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.error("Set CLASH_ROYALE_API_KEY in .env");
    process.exit(1);
  }

  // 1. Collect unique player tags from all regions
  console.log("Fetching top players from leaderboards...");
  const allTags = new Set<string>();
  for (const locId of LOCATION_IDS) {
    const tags = await fetchTopPlayers(locId);
    tags.forEach((t) => allTags.add(t));
    console.log(`  Location ${locId}: ${tags.length} players`);
    await sleep(REQUEST_DELAY_MS);
  }
  console.log(`Total unique players: ${allTags.size}`);

  // 2. Fetch battle logs
  console.log("Fetching battle logs...");
  const allBattles: Battle[] = [];
  let i = 0;
  for (const tag of allTags) {
    i++;
    if (i % 50 === 0) console.log(`  Progress: ${i}/${allTags.size}`);
    const battles = await fetchBattleLog(tag);
    allBattles.push(...battles);
    await sleep(REQUEST_DELAY_MS);
  }
  console.log(`Total battles collected: ${allBattles.length}`);

  // 3. Aggregate
  console.log("Aggregating deck stats...");
  const deckMap = aggregateDecks(allBattles);
  console.log(`Unique decks found: ${deckMap.size}`);
  console.log(`Decks with >= ${MIN_DECK_COUNT} games: ${Array.from(deckMap.values()).filter((d) => d.total >= MIN_DECK_COUNT).length}`);

  // 4. Assign to arenas and output
  const output = assignDecksToArenas(deckMap);
  const deckCount = output["1"]?.length ?? 0;
  console.log(`Decks per arena: ${deckCount}`);

  // Verify HOT_CARDS coverage
  for (const hotCard of HOT_CARDS) {
    const count = (output["1"] ?? []).filter((d) => d.cards.includes(hotCard)).length;
    console.log(`  ${hotCard}: ${count} decks${count < 3 ? " ⚠️ LOW" : ""}`);
  }

  const outPath = path.join(__dirname, "..", "src", "lib", "generated-decks.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\nWritten to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
