import { Card } from "./data";

// Hot cards for the first batch (50-80 pages)
export const HOT_CARDS = [
  "Hog Rider",
  "P.E.K.K.A",
  "Giant",
  "Balloon",
];

export function cardNameToSlug(name: string): string {
  return name
    .replace(/\.+/g, "") // P.E.K.K.A → PEKKA
    .replace(/'/g, "")   // P.E.K.K.A's → PEKKAs
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function getCardBySlug(slug: string, allCards: Card[]): Card | undefined {
  return allCards.find((c) => cardNameToSlug(c.name) === slug);
}
