// Arena data: id, name, trophies required, key cards
export interface Arena {
  id: number;
  name: string;
  trophies: number;
  slug: string;
}

export const ARENAS: Arena[] = [
  { id: 1, name: "Goblin Stadium", trophies: 0, slug: "arena-1" },
  { id: 2, name: "Bone Pit", trophies: 300, slug: "arena-2" },
  { id: 3, name: "Barbarian Bowl", trophies: 600, slug: "arena-3" },
  { id: 4, name: "P.E.K.K.A's Playhouse", trophies: 1000, slug: "arena-4" },
  { id: 5, name: "Spell Valley", trophies: 1300, slug: "arena-5" },
  { id: 6, name: "Builder's Workshop", trophies: 1600, slug: "arena-6" },
  { id: 7, name: "Royal Arena", trophies: 2000, slug: "arena-7" },
  { id: 8, name: "Frozen Peak", trophies: 2300, slug: "arena-8" },
  { id: 9, name: "Jungle Arena", trophies: 2600, slug: "arena-9" },
  { id: 10, name: "Hog Mountain", trophies: 3000, slug: "arena-10" },
  { id: 11, name: "Electro Valley", trophies: 3400, slug: "arena-11" },
  { id: 12, name: "Spooky Town", trophies: 3800, slug: "arena-12" },
  { id: 13, name: "Rascal's Hideout", trophies: 4200, slug: "arena-13" },
  { id: 14, name: "Serenity Peak", trophies: 4600, slug: "arena-14" },
  { id: 15, name: "Miner's Mine", trophies: 5000, slug: "arena-15" },
  { id: 16, name: "Executioner's Kitchen", trophies: 5500, slug: "arena-16" },
  { id: 17, name: "Royal Crypt", trophies: 6000, slug: "arena-17" },
  { id: 18, name: "Silent Sanctuary", trophies: 6500, slug: "arena-18" },
  { id: 19, name: "Dragon Spa", trophies: 7000, slug: "arena-19" },
  { id: 20, name: "Legendary Arena", trophies: 7500, slug: "arena-20" },
];

export interface Card {
  name: string;
  id: number;
  maxLevel: number;
  elixirCost: number;
  iconUrl: string;
  rarity: string;
}

export interface Deck {
  cards: Card[];
  avgElixir: number;
  winRate?: number;
  useRate?: number;
}
