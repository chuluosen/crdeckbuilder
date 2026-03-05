import { Card, Deck } from "./data";

// Card role descriptions for known cards
const CARD_ROLES: Record<string, string> = {
  "Hog Rider": "a fast single-target win condition that dashes past troops to hit buildings",
  "P.E.K.K.A": "a high-damage tank that shreds through single targets and punishes overcommits",
  "Giant": "a slow, durable tank that soaks up tower damage while support troops deal damage behind it",
  "Balloon": "an air win condition that drops a death bomb on towers when destroyed",
  "Golem": "a heavyweight beatdown tank that splits into Golemites on death",
  "Lava Hound": "an air tank that splits into fast Lava Pups, commonly used with Balloon behind it",
  "Goblin Barrel": "a 3-elixir spell-win-condition that sends Goblins directly onto the tower",
  "Miner": "a 3-elixir chip damage card that tunnels directly to a targeted tile, great for constant pressure",
  "Royal Giant": "a ranged tank that attacks buildings from a distance, hard to distract with ground troops",
  "X-Bow": "a siege building that targets towers from your side of the arena",
  "Mega Knight": "a high-HP troop with a powerful landing stomp that wipes swarms on deployment",
  "Sparky": "an electric tower-shredder that charges between attacks — reset by any zap or electric card",
  "Electro Giant": "a tank that zaps nearby troops when it takes damage, disabling Inferno-type counters",
  "Valkyrie": "a splash-damage ground troop that clears swarms and supports pushes from behind",
};

// Win rate tier labels
function wrLabel(wr: number): string {
  if (wr >= 70) return "elite";
  if (wr >= 60) return "strong";
  if (wr >= 55) return "solid";
  return "competitive";
}

// Generate a data-driven description for a card on a specific arena page
export function getCardArenaContent(
  card: Card,
  arenaId: number,
  arenaName: string,
  decks: Deck[]
): string {
  if (decks.length === 0) return "";

  const deckCount = decks.length;
  const avgWR =
    decks.reduce((s, d) => s + (d.winRate ?? 0), 0) / deckCount;
  const bestWR = Math.max(...decks.map((d) => d.winRate ?? 0));
  const avgElixir =
    decks.reduce((s, d) => s + d.avgElixir, 0) / deckCount;

  // Most common co-cards (excluding the focal card)
  const coCount: Record<string, number> = {};
  decks.forEach((d) =>
    d.cards.forEach((c) => {
      if (c.name !== card.name) coCount[c.name] = (coCount[c.name] ?? 0) + 1;
    })
  );
  const topCo = Object.entries(coCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const role = CARD_ROLES[card.name] ?? "a key card in many competitive builds";
  const tier = wrLabel(avgWR);

  // Sentence 1: card identity + arena context
  const s1 = `${card.name} is ${role}. At ${arenaName} (Arena ${arenaId}), it appears in ${deckCount} of the top-performing deck${deckCount > 1 ? "s" : ""} available at this trophy range.`;

  // Sentence 2: win rate
  const s2 =
    bestWR > avgWR + 3
      ? `Across these builds, ${card.name} averages a ${tier} ${avgWR.toFixed(1)}% win rate, with the strongest lineup reaching ${bestWR}%.`
      : `These decks average a ${tier} ${avgWR.toFixed(1)}% win rate at this level.`;

  // Sentence 3: average elixir + combos
  const comboStr =
    topCo.length >= 3
      ? `${topCo[0]}, ${topCo[1]}, and ${topCo[2]}`
      : topCo.join(" and ");
  const s3 = `The decks featuring ${card.name} here average ${avgElixir.toFixed(1)} elixir, most commonly pairing it with ${comboStr}.`;

  // Sentence 4: practical tip based on card type and win rate
  let s4 = "";
  if (card.name === "Hog Rider") {
    s4 =
      "Play the Hog Rider on the bridge after defending a push to convert leftover elixir into a counter-attack. Cycle back to it as fast as possible.";
  } else if (card.name === "Valkyrie") {
    s4 =
      "Deploy Valkyrie in the pocket behind your tank to clear swarms. Her spin attack hits all sides, making her effective against Skeleton Army, Goblins, and Barbarians.";
  } else if (card.name === "Giant") {
    s4 =
      "Place Giant at the back of your King Tower to build elixir before the push reaches the bridge. Drop support troops once Giant crosses mid.";
  } else if (card.name === "Electro Giant") {
    s4 =
      "Electro Giant's passive zap disables Inferno Tower and Inferno Dragon mid-lock. Pair with Tornado to pull enemy troops into his zap range and activate your King Tower.";
  } else if (card.name === "Goblin Barrel") {
    s4 =
      "Throw Goblin Barrel at the same time as a tank or spell to split the defender's attention. The Log or Fireball from the opponent is the main thing to watch out for.";
  } else if (card.name === "Miner") {
    s4 =
      "Use Miner to tank for a Goblin Barrel or to chip the tower while your opponent is distracted defending another push. Constant pressure forces mistakes.";
  } else if (card.name === "Sparky") {
    s4 =
      "Protect Sparky from resets — never pair her with Zap or Electro Spirit on the same push. Use Mini P.E.K.K.A or a tank to absorb attention while she charges.";
  } else if (card.name === "X-Bow") {
    s4 =
      "Lock the X-Bow range onto the tower and defend it with low-cost troops. The goal is to deal chip damage over multiple cycles, not to win in a single push.";
  } else if (card.name === "Mega Knight") {
    s4 =
      "Drop Mega Knight on a cluster of enemy troops to maximize the landing stomp. He works best as a reactive counter-push unit rather than a starting push.";
  } else if (card.name === "Balloon") {
    s4 =
      "Always protect Balloon from air defenses — Inferno Dragon and Mega Minion are its biggest threats. Use Freeze or Rage to secure tower hits once it connects.";
  } else if (card.name === "Lava Hound") {
    s4 =
      "Place Lava Hound at the back to build up a full push. Add Balloon once Lava Hound crosses the bridge so the tower must deal with both simultaneously.";
  } else if (card.name === "Golem") {
    s4 =
      "Golem requires patience — place it at the back and spend the full elixir cycle building support behind it. Never push with Golem without at least one spell ready.";
  } else if (card.name === "Royal Giant") {
    s4 =
      "Royal Giant's range lets him attack buildings from behind the river. Pair with Electro Spirit to stun defenses and Fisherman to pull Inferno Tower away mid-lock.";
  } else if (card.name === "P.E.K.K.A") {
    s4 =
      "P.E.K.K.A is a reactive card — use her to shut down big beatdown pushes, then counter-push with the surviving P.E.K.K.A and a cheap support unit.";
  } else {
    s4 = `${card.name} fits best in decks that average around ${avgElixir.toFixed(1)} elixir, giving you enough cycling speed to use it multiple times per game.`;
  }

  return [s1, s2, s3, s4].join(" ");
}
