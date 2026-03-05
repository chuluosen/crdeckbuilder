// Arena-specific strategy descriptions based on real deck data.
// Each entry is unique to that trophy range's card pool and meta.
export const ARENA_CONTENT: Record<number, { tip: string }> = {
  1: {
    tip: "At Goblin Stadium, only a handful of cards are available, so deck options are limited — just 4 viable builds. The core lineup revolves around Giant as a tank, Musketeer for ranged damage, and Knight as a ground defender. Win rates are close to 50% across all decks, which is expected at this level. Focus on learning what each card does rather than chasing perfect win rates.",
  },
  2: {
    tip: "Bone Pit (300+ trophies) opens up Valkyrie, a splash-damage troop that counters swarms reliably. The best deck here pairs Giant with Valkyrie and Musketeer for a straightforward beatdown push. Fireball becomes increasingly important from this arena onward — it handles Musketeer mirrors and clears defensive troops in one shot. With 7 deck options available, you have more flexibility than Arena 1.",
  },
  3: {
    tip: "Barbarian Bowl introduces Cannon, which becomes a staple defensive building across all future arenas. The top-performing deck (53% win rate) runs Knight, Musketeer, Mini P.E.K.K.A, and Fireball — a cycle-friendly setup with no card above 5 elixir. Fireball and Arrows are in the majority of top decks here, so make sure you have at least one spell in your lineup.",
  },
  4: {
    tip: "P.E.K.K.A's Playhouse (1000+ trophies) unlocks P.E.K.K.A itself, but the 7-elixir cost makes it hard to fit into efficient decks — it doesn't appear in the top builds here. Knight-Musketeer-Mini P.E.K.K.A-Cannon remains the strongest template at 53% win rate. Fireball and Arrows dominate the spell slots across all 13 available decks. Keep your average elixir under 3.5 to cycle consistently.",
  },
  5: {
    tip: "Spell Valley (1300+ trophies) is where the meta shifts significantly: Hog Rider unlocks here and immediately becomes the game's most consistent win condition. The top deck — Hog Rider, Valkyrie, Musketeer, Fireball, Zap, Skeletons, Cannon, Mega Minion — runs at 54% win rate with just 3.1 average elixir. If you have Hog Rider leveled up, this is the deck to run. Zap first appears as a top card at this tier.",
  },
  6: {
    tip: "Builder's Workshop (1600+ trophies) adds Goblin Barrel and X-Bow to the pool, but Hog Rider cycle continues to dominate at 54% win rate. The Hog Rider + Goblin Barrel combo becomes viable here — pairing two fast win conditions that are hard to defend simultaneously. Valkyrie appears in over 70% of top 18 decks as the preferred ground support. Average elixir across top decks stays low at 3.3.",
  },
  7: {
    tip: "Royal Arena (2000+ trophies) unlocks Royal Giant, giving players a second reliable tank option alongside regular Giant. The card pool expands to 21 viable builds. Hog Rider cycle holds at 54% win rate, but Giant beatdown remains a strong alternative for players who prefer slower, push-based strategies. Fireball, Musketeer, Valkyrie, and Mega Minion appear in over half of all top decks at this range.",
  },
  8: {
    tip: "Frozen Peak (2300+ trophies) introduces Ice Spirit — a 1-elixir card that appears in the top-ranked deck (55% win rate). That deck runs: Hog Rider, Valkyrie, Musketeer, Fireball, Zap, Ice Spirit, Cannon, Skeletons — averaging just 2.9 elixir. This is one of the most elixir-efficient builds in the game. Fireball shows up in 79% of all 24 viable decks here, making it the most impactful card at this trophy range.",
  },
  9: {
    tip: "Jungle Arena (2600+ trophies) unlocks Prince and Dark Prince, and a Giant + Prince + Dark Prince beatdown deck immediately stands out with a 79% win rate in our dataset. This deck applies two charging threats simultaneously, overwhelming most defenses. The pool expands to 27 decks. Valkyrie and Fireball remain the most consistent core cards. If you have Prince unlocked, the Giant beatdown archetype is worth experimenting with here.",
  },
  10: {
    tip: "Hog Mountain (3000+ trophies) shares the same card pool as Jungle Arena, with 27 viable builds and the Giant-Prince-Dark Prince combo still leading at 79%. The real difference at this tier is player skill — opponents consistently make better use of cycle cards. Cycle decks averaging under 3.2 elixir let you react faster and apply more pressure per game. Don't overcommit elixir; patience and counter-pushes win more games than raw power here.",
  },
  11: {
    tip: "Electro Valley (3400+ trophies) brings Lightning and Electro Wizard into the mix, and the card pool grows to 31 decks. The top 3 decks span a wider win-rate range (79% / 74% / 66%), meaning there are multiple strong archetypes at this range rather than one clear dominant choice. Skeletons enters the top 5 most common cards for the first time, reflecting the importance of cheap cycle cards and swarm counters at higher trophies.",
  },
  12: {
    tip: "Spooky Town (3800+ trophies) unlocks Night Witch and Graveyard, pushing the available pool to 37 decks. Notably, 14 of those are low-elixir cycle builds (under 3.2 average), the most of any arena so far — showing how important fast cycling becomes at this trophy range. The top 3 decks are tightly clustered (79% / 75% / 74%), so deck selection matters less than execution. Knight replaces Giant as a more common card in top builds.",
  },
  13: {
    tip: "Rascal's Hideout (4200+ trophies) sees the first high-elixir deck (4.0+ average) appear among top builds, signaling the start of heavier beatdown viability. The pool reaches 41 decks. Valkyrie and Fireball continue their run as the most consistent core picks across archetypes. If you're facing push-heavy players, prioritize Cannon or Tesla for defensive buildings — the data shows most top decks here include at least one defensive structure.",
  },
  14: {
    tip: "Serenity Peak (4600+ trophies) adds more unlock options and 2 high-elixir builds now compete in the top tier. With 46 viable decks, this is one of the most diverse metas below 5000 trophies. The top 3 win rates converge (79% / 76% / 75%) — meaning multiple archetypes work. Fireball, Knight, Valkyrie, and Skeletons appear in the largest share of top builds; any deck running all four has a strong defensive core.",
  },
  15: {
    tip: "Miner's Mine (5000+ trophies) marks a major meta shift: Electro Giant unlocks here and immediately becomes the highest win-rate card in the pool. The top deck — Bowler, Electro Giant, Goblins, Lightning, Musketeer, Skeletons, Tesla, Tornado — runs at 80% win rate. This beatdown build pairs Electro Giant's ability to disable defenses with Bowler's push-clearing splash. 5 high-elixir options now exist alongside 18 cycle builds, giving players more varied strategic choices.",
  },
  16: {
    tip: "Executioner's Kitchen (5500+ trophies) unlocks Executioner, and the heavy deck count jumps to 8 — the highest so far. Electro Giant beatdown retains its 80% win rate lead. Zap becomes the second most common card, replacing Skeletons in that role — the shift reflects how important instant-reset spells are at this level. With 58 deck options, there's room to find a playstyle that suits you, but the Electro Giant + Bowler core is the safest starting point.",
  },
  17: {
    tip: "Royal Crypt (6000+ trophies) sits near the top of the ladder, and the card pool is nearly complete at 62 viable decks. Zap overtakes Fireball as the most common card for the first time — a sign that cycle speed and instant-reset value dominate decision-making at this level. Electro Giant beatdown (80% win rate) remains the benchmark. If you're running a cycle deck, keep average elixir below 3.2 and practice counting opponent elixir.",
  },
  18: {
    tip: "Silent Sanctuary (6500+ trophies) is one of the most competitive arenas before Legendary. The available pool (63 decks) is nearly identical to Arena 17, with Zap and Fireball as the top two spells and Electro Giant beatdown still leading at 80%. Players here have typically refined their mechanics, so the gap between good deck choice and good execution is smaller. Focus on consistent defense and knowing when to counter-push rather than forcing attacks.",
  },
  19: {
    tip: "Dragon Spa (7000+ trophies) reaches the full card pool: all 79 viable builds are now available, matching Legendary Arena. Heavy beatdown decks peak here with 12 high-elixir options, and cycle builds account for 23 of the 79 decks. The top deck — Bowler, Electro Giant, Goblins, Lightning, Musketeer, Skeletons, Tesla, Tornado — has held its 80% win rate from Arena 15. One trophy range below Legendary, expect opponents who know their deck inside and out.",
  },
  20: {
    tip: "Legendary Arena (7500+ trophies) is the highest ranked tier in Clash Royale, with the full card pool of 79 viable builds. The meta splits between 23 fast cycle decks and 12 heavy beatdown builds. Electro Giant + Bowler + Lightning remains the top-performing combination at 80% win rate, but skilled players succeed with almost any well-tuned archetype. Fireball, Zap, Skeletons, Valkyrie, and Knight appear across the widest range of decks — any build including these has a proven foundation.",
  },
};
