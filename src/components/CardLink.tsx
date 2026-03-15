"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function CardLink({
  href,
  cardName,
  arenaId,
}: {
  href: string;
  cardName: string;
  arenaId: number;
}) {
  return (
    <Link
      href={href}
      className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-yellow-400 hover:bg-gray-700"
      onClick={() =>
        trackEvent("card_click", {
          card_name: cardName,
          arena_id: arenaId,
        })
      }
    >
      {cardName}
    </Link>
  );
}
