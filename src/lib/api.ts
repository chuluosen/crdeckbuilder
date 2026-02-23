import { Card } from "./data";
import cardsData from "./cards.json";

export async function fetchAllCards(): Promise<Card[]> {
  return cardsData as Card[];
}
