import Link from "next/link";
import { ARENAS } from "@/lib/data";

export function ArenaList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {ARENAS.map((arena) => (
        <Link
          key={arena.id}
          href={`/arena/${arena.slug}`}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition-colors"
        >
          <div className="text-yellow-400 font-bold">Arena {arena.id}</div>
          <div className="text-white text-sm">{arena.name}</div>
          <div className="text-gray-400 text-xs mt-1">{arena.trophies}+ Trophies</div>
        </Link>
      ))}
    </div>
  );
}
