export interface OpportunitySection {
  heading: string;
  body: string;
}

export interface OpportunityGuide {
  key: string;
  arenaSlug: string;
  cardSlug: string;
  cardName: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  linkLabel: string;
  linkSummary: string;
  sections: OpportunitySection[];
}

const GUIDES: OpportunityGuide[] = [
  {
    key: "arena-19/hog-rider",
    arenaSlug: "arena-19",
    cardSlug: "hog-rider",
    cardName: "Hog Rider",
    path: "/arena/arena-19/hog-rider",
    title: "Best Arena 19 Hog Rider Decks - Dragon Spa Cycle Decks",
    description:
      "Best Hog Rider decks for Arena 19 Dragon Spa in Clash Royale. Compare cycle decks, bridge pressure lists, pairings, counters, sample size, and copy deck links.",
    h1: "Best Arena 19 Hog Rider Decks",
    intro:
      "Arena 19 is close to a complete-card-pool environment, so Hog Rider decks need more than bridge spam. The best lists here use fast cycle cards, cheap defense, and one clean punish window after the opponent spends too much elixir.",
    linkLabel: "Hog Rider cycle decks",
    linkSummary: "Fast pressure decks for Dragon Spa.",
    sections: [
      {
        heading: "Why Hog Rider Works in Dragon Spa",
        body:
          "Dragon Spa gives opponents access to most common defensive tools, so Hog Rider works best as a repeatable win condition rather than a single all-in push. Use it to punish heavy cards played in the back, then defend cheaply and cycle back before the next building is ready.",
      },
      {
        heading: "Best Pairings",
        body:
          "Prioritize support cards that keep the deck moving: cheap cycle, a small spell, one sturdy ground defender, and a building or reset card. The co-card data on this page is useful because it shows which support cards repeatedly appear beside Hog Rider in the recorded ladder dataset.",
      },
      {
        heading: "Counters to Watch",
        body:
          "Buildings, Tornado, and fast swarm answers are the main problems. If the opponent has a reliable building, do not send every Hog Rider alone. Force out the counter first, defend the follow-up push, then attack when their cycle is awkward.",
      },
      {
        heading: "Choosing a Listed Deck",
        body:
          "Pick lower-elixir lists if you like constant pressure and faster rematches against counters. Pick lists with sturdier defenders if you are losing to beatdown pushes. The safest deck is not always the highest win-rate list; use sample size and average elixir together.",
      },
    ],
  },
  {
    key: "arena-17/hog-rider",
    arenaSlug: "arena-17",
    cardSlug: "hog-rider",
    cardName: "Hog Rider",
    path: "/arena/arena-17/hog-rider",
    title: "Best Arena 17 Hog Rider Decks - Royal Crypt Cycle Decks",
    description:
      "Best Hog Rider decks for Arena 17 Royal Crypt in Clash Royale. Find cycle decks, defensive cores, bridge pressure tips, counters, and copy deck links.",
    h1: "Best Arena 17 Hog Rider Decks",
    intro:
      "Arena 17 Royal Crypt is where Hog Rider starts to feel like a timing test. The card is still simple to use, but the wins usually come from defending first, counting the opponent's key counter, and sending Hog Rider when their next answer is out of cycle.",
    linkLabel: "Hog Rider Royal Crypt decks",
    linkSummary: "Cycle and counter-push lists for Arena 17.",
    sections: [
      {
        heading: "Royal Crypt Game Plan",
        body:
          "Treat Hog Rider as a pressure tool that turns small defensive wins into tower damage. If you spend too much support behind it, you lose the cycle advantage that makes Hog Rider valuable. Defend with cheap cards, then attack before the opponent rebuilds elixir.",
      },
      {
        heading: "Best Pairings",
        body:
          "The strongest Arena 17 Hog Rider lists usually need a small spell, a medium spell, and a stable defensive card. Use the listed decks to decide whether you want a pure cycle version or a safer version with more defensive weight.",
      },
      {
        heading: "Counters to Watch",
        body:
          "Cannon-style buildings, Tornado pulls, and swarm cards can stop direct Hog Rider pressure. When you see those counters, vary the timing instead of repeating the same bridge placement. A delayed Hog after defense often performs better than a first-play Hog.",
      },
      {
        heading: "Replacement Options",
        body:
          "If you are missing one support card, replace it by role rather than rarity. Keep the deck's average elixir close to the listed version, keep at least one reliable spell, and avoid replacing cheap cycle cards with expensive troops.",
      },
    ],
  },
  {
    key: "arena-19/balloon",
    arenaSlug: "arena-19",
    cardSlug: "balloon",
    cardName: "Balloon",
    path: "/arena/arena-19/balloon",
    title: "Best Arena 19 Balloon Decks - Dragon Spa Air Attack Decks",
    description:
      "Best Balloon decks for Arena 19 Dragon Spa in Clash Royale. Compare air attack decks, tank pairings, spell support, counters, sample size, and copy deck links.",
    h1: "Best Arena 19 Balloon Decks",
    intro:
      "Balloon is a high-reward win condition in Arena 19, but Dragon Spa opponents usually have enough air defense to punish a naked Balloon. The better lists use Balloon after a defensive stop, behind a tank, or when a key air counter has already been forced out.",
    linkLabel: "Balloon air attack decks",
    linkSummary: "Dragon Spa lists built around tower pressure from the air.",
    sections: [
      {
        heading: "Why Balloon Needs Setup",
        body:
          "At this arena, Balloon rarely wins by surprise alone. It needs a tank, a spell, or a counter-push window to reach the tower. Look for decks that include enough ground defense to survive first, because the best Balloon pushes often start from a defended lane.",
      },
      {
        heading: "Best Pairings",
        body:
          "Good Balloon decks protect the approach. Tanks soak tower fire, small spells clear swarms, and freeze or rage effects can turn one connection into a tower-leveling push. Check the co-card data to see which support cards appear most often in the listed decks.",
      },
      {
        heading: "Counters to Watch",
        body:
          "Air-targeting troops, Inferno-style damage, and buildings can shut down Balloon before it drops damage. Do not reveal your full push until you know which answer the opponent is relying on, and avoid feeding them a clean counter-push.",
      },
      {
        heading: "Choosing a Listed Deck",
        body:
          "Choose heavier Balloon lists if you like building one large push. Choose lighter versions if you want more chances to attack after every defense. The right list depends on whether you lose more often to air counters or to pressure in the opposite lane.",
      },
    ],
  },
  {
    key: "arena-16/miner",
    arenaSlug: "arena-16",
    cardSlug: "miner",
    cardName: "Miner",
    path: "/arena/arena-16/miner",
    title: "Best Arena 16 Miner Decks - Miner Control Decks",
    description:
      "Best Miner decks for Arena 16 Executioner's Kitchen in Clash Royale. Find Miner control decks, chip damage plans, support cards, counters, and copy deck links.",
    h1: "Best Arena 16 Miner Decks",
    intro:
      "Miner decks in Arena 16 are built around controlled chip damage. Instead of trying to win with one huge push, these lists use Miner to tank for small units, finish weakened towers, and keep pressure on the lane where the opponent is already spending elixir.",
    linkLabel: "Miner control decks",
    linkSummary: "Chip damage and pressure lists for Arena 16.",
    sections: [
      {
        heading: "Arena 16 Miner Plan",
        body:
          "Executioner's Kitchen has enough defensive options that Miner should be used with purpose. Send it to tank for surviving troops, punish an expensive card in the back, or force a response when the opponent wants to build a slow push.",
      },
      {
        heading: "Best Pairings",
        body:
          "Miner works best with cards that create repeated small threats: cheap swarms, spells, and control defenders. Use the listed decks to compare whether each build is more chip-focused, counter-push focused, or built to support another win condition.",
      },
      {
        heading: "Counters to Watch",
        body:
          "Predictable Miner placements lose value quickly. Change tower tiles, watch for small troop catches, and do not overspend if the opponent keeps answering Miner for a positive trade. The goal is steady pressure, not one perfect connection.",
      },
      {
        heading: "Replacement Options",
        body:
          "When replacing cards, protect the control shell. Keep one dependable defensive answer, one spell for swarms, and enough cheap cards to cycle Miner often. Expensive replacements can make the deck slower than the listed version suggests.",
      },
    ],
  },
  {
    key: "arena-17/goblin-barrel",
    arenaSlug: "arena-17",
    cardSlug: "goblin-barrel",
    cardName: "Goblin Barrel",
    path: "/arena/arena-17/goblin-barrel",
    title: "Best Arena 17 Goblin Barrel Decks - Royal Crypt Bait Decks",
    description:
      "Best Goblin Barrel decks for Arena 17 Royal Crypt in Clash Royale. Compare bait decks, spell pressure, counters, replacement options, and copy deck links.",
    h1: "Best Arena 17 Goblin Barrel Decks",
    intro:
      "Goblin Barrel decks in Arena 17 are about spell pressure. The card becomes much stronger when the deck can force out Log, Zap, Arrows, or small splash answers before the Barrel lands. These lists are best for players who like tracking counters and changing placements.",
    linkLabel: "Goblin Barrel bait decks",
    linkSummary: "Royal Crypt bait lists built around spell pressure.",
    sections: [
      {
        heading: "Royal Crypt Bait Plan",
        body:
          "Do not treat Goblin Barrel as a standalone tower hit. Its job is to punish a missing spell or create pressure that makes the opponent spend elixir inefficiently. The best bait decks keep offering small threats until the Barrel has a cleaner window.",
      },
      {
        heading: "Best Pairings",
        body:
          "Look for decks with multiple cards that demand the same answer. If the opponent spends a spell on a swarm, a delayed Goblin Barrel becomes stronger. If they hold the spell for Barrel, your other cheap threats can chip and defend efficiently.",
      },
      {
        heading: "Counters to Watch",
        body:
          "Small spells, splash troops, and careful king tower activations can reduce Barrel value. Vary the landing tile, especially after the opponent proves they can catch the standard placement. Repeating the same throw makes defense too easy.",
      },
      {
        heading: "Choosing a Listed Deck",
        body:
          "Pick classic bait-style lists if you are comfortable tracking the opponent's spell cycle. Pick sturdier versions if you need more defensive stability against heavy pushes. The deck list, sample size, and average elixir help separate those two styles.",
      },
    ],
  },
  {
    key: "arena-17/royal-giant",
    arenaSlug: "arena-17",
    cardSlug: "royal-giant",
    cardName: "Royal Giant",
    path: "/arena/arena-17/royal-giant",
    title: "Best Arena 17 Royal Giant Decks - Royal Crypt RG Decks",
    description:
      "Best Royal Giant decks for Arena 17 Royal Crypt in Clash Royale. Compare RG support cards, building counters, defensive cores, sample size, and copy deck links.",
    h1: "Best Arena 17 Royal Giant Decks",
    intro:
      "Royal Giant gives Arena 17 players a direct tower threat that does not need to cross the bridge. The tradeoff is that every push needs protection: if the opponent's building, Inferno card, or swarm answer survives too long, Royal Giant damage disappears.",
    linkLabel: "Royal Giant RG decks",
    linkSummary: "Arena 17 ranged tank decks with stable support.",
    sections: [
      {
        heading: "Royal Crypt RG Plan",
        body:
          "Use Royal Giant after a defensive stop or when the opponent cannot pressure the opposite lane. Dropping it too early gives the opponent time to set a building and build a counter-push. A protected Royal Giant is much stronger than a rushed one.",
      },
      {
        heading: "Best Pairings",
        body:
          "Royal Giant needs cards that clear swarms, reset or distract building damage, and protect it from high-damage defenders. The listed decks show which support packages appear with RG in the recorded data, so compare those cores before choosing a version.",
      },
      {
        heading: "Counters to Watch",
        body:
          "Buildings, Inferno-style damage, and cheap swarm cards are the main answers. Save a spell or reset effect for the defender that actually stops tower damage. Spending support too early often leaves Royal Giant exposed.",
      },
      {
        heading: "Replacement Options",
        body:
          "If you replace a support card, keep the same job covered. A spell should replace a spell, a reset card should replace a reset card, and a defensive troop should not become a second win condition unless the average elixir still makes sense.",
      },
    ],
  },
  {
    key: "high-arenas/royal-giant",
    arenaSlug: "high-arenas",
    cardSlug: "royal-giant",
    cardName: "Royal Giant",
    path: "/arena/high-arenas/royal-giant",
    title: "Best Royal Giant Decks 2026 - Clash Royale High Arena Decks",
    description:
      "Best Royal Giant decks for Clash Royale high arenas. Compare RG ladder decks, support cores, building counters, sample size, and copy deck links.",
    h1: "Best Royal Giant Decks for High Arenas",
    intro:
      "This page is the main Royal Giant guide for high-arena ladder play. Instead of splitting similar Arena 18, 19, and 20 RG lists into near-duplicate pages, it groups the strongest high-arena options so you can compare support cores in one place.",
    linkLabel: "High-arena Royal Giant decks",
    linkSummary: "The main RG page for upper ladder lists.",
    sections: [
      {
        heading: "Why This Page Is Grouped",
        body:
          "Royal Giant lists in the highest arenas often overlap because the card pool is nearly complete. Grouping the high-arena data gives this page a clearer purpose: compare the best RG support packages without forcing several thin pages to answer the same search.",
      },
      {
        heading: "Best Pairings",
        body:
          "Look for support cards that protect Royal Giant from buildings, swarms, and high-damage defenders. The deck list should keep enough defense to survive before the RG push, because many strong attacks begin after a successful stop.",
      },
      {
        heading: "Counters to Watch",
        body:
          "Buildings and Inferno-style cards are the most important counters to plan around. If your selected deck lacks a reset, pull, or reliable spell answer, it may still win games but will be harder to play into prepared defenses.",
      },
      {
        heading: "Choosing a Listed Deck",
        body:
          "Compare average elixir, sample size, and the support cards around Royal Giant. Faster lists reward repeated pressure; heavier lists can defend better and build stronger counter-pushes. Pick the style that matches how you usually lose games.",
      },
    ],
  },
];

export const OPPORTUNITY_GUIDES: Record<string, OpportunityGuide> = GUIDES.reduce(
  (acc, guide) => {
    acc[guide.key] = guide;
    return acc;
  },
  {} as Record<string, OpportunityGuide>
);

export function getOpportunityGuide(
  arenaSlug: string,
  cardSlug: string
): OpportunityGuide | undefined {
  return OPPORTUNITY_GUIDES[`${arenaSlug}/${cardSlug}`];
}

export function getOpportunityGuidesForArena(arenaSlug: string): OpportunityGuide[] {
  return GUIDES.filter((guide) => guide.arenaSlug === arenaSlug);
}

export function getOpportunityArenaCardPairs(): {
  arenaSlug: string;
  cardSlug: string;
}[] {
  return GUIDES
    .filter((guide) => guide.arenaSlug !== "high-arenas")
    .map((guide) => ({
      arenaSlug: guide.arenaSlug,
      cardSlug: guide.cardSlug,
    }));
}

export function getOpportunityHighArenaCardSlugs(): string[] {
  return GUIDES
    .filter((guide) => guide.arenaSlug === "high-arenas")
    .map((guide) => guide.cardSlug);
}
