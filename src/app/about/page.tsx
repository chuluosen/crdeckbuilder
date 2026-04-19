import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About CR Deck Builder — how we collect and rank Clash Royale decks using win rate data from the official API.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-gray-300">
      <h1 className="text-3xl font-bold text-white">About CR Deck Builder</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">What Is This Site?</h2>
        <p>
          CR Deck Builder helps Clash Royale players find decks that actually
          work in their arena. Instead of copying a random deck from social
          media, you can browse top-performing decks filtered by the cards you
          already own — so every recommendation is something you can build right
          now.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Where Does the Data Come From?</h2>
        <p>
          All deck data is sourced from the{" "}
          <a
            href="https://developer.clashroyale.com/"
            className="text-yellow-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            official Clash Royale API
          </a>
          . We sample battle logs from top-ranked players across multiple
          regions, then calculate win rates using a Bayesian average to prevent
          small-sample flukes from skewing the rankings.
        </p>
        <p>
          Decks are assigned to arenas based on card unlock levels — if a deck
          contains a card that unlocks in Arena 14, that deck appears on the
          Arena 14 page and above, not below.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">How Are Decks Ranked?</h2>
        <p>
          Each deck is scored by combining its win rate and usage rate. A deck
          needs to perform well <em>and</em> be played frequently to rank
          highly. We apply a Bayesian average so a deck with only a handful of
          matches can&apos;t outrank a proven meta choice just because of an
          early lucky streak.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Who Built This?</h2>
        <p>
          CR Deck Builder is an independent project. It is not affiliated with,
          endorsed, sponsored, or approved by Supercell. Clash Royale and all
          related assets are trademarks of Supercell.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p>
          Have feedback or questions? Reach out at{" "}
          <a
            href="mailto:chuluosen4869@gmail.com"
            className="text-yellow-400 hover:underline"
          >
            chuluosen4869@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
