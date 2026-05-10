import Link from "next/link";
import { ArenaList } from "@/components/ArenaList";
import { buildWebSiteSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/jsonld";

const HOME_FAQS = [
  {
    question: "How do I choose the best deck for my arena?",
    answer:
      "Select your current arena from the list above. Each arena page shows the top-performing decks sorted by win rate. Pick a deck that matches cards you already have and fits your playstyle — whether that's aggressive beatdown, defensive control, or fast cycle.",
  },
  {
    question: "How often are the deck recommendations updated?",
    answer:
      "Our deck data reflects the current Clash Royale meta. We track win rates and usage statistics across arenas to make sure the recommendations stay relevant after each balance update.",
  },
  {
    question: "Can I filter decks by the cards I own?",
    answer:
      "Yes! Each arena page has an interactive card filter. Select the cards you own, and the tool instantly shows three categories: decks you can build right now, decks where you're missing just 1 card, and decks where you're missing 2 cards. Your selections are saved automatically so you don't have to re-select next time.",
  },
  {
    question: "Can I find decks for a specific card?",
    answer:
      "Yes. Some arena pages include focused card guides for high-intent matchups like Hog Rider, Miner, Balloon, Goblin Barrel, and Royal Giant. These guide pages add matchup notes, support-card context, and deck lists instead of exposing every possible card combination.",
  },
  {
    question: "What do win rate and usage rate mean?",
    answer:
      "Win rate is the percentage of matches a deck wins. Usage rate shows how popular a deck is among players. A high win rate with decent usage means the deck is both strong and proven in real matches.",
  },
];

export default function Home() {
  const websiteSchema = buildWebSiteSchema();
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Home", path: "/" }]);
  const faqSchema = buildFaqSchema(HOME_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Clash Royale Deck Builder
        </h1>
        <p className="text-gray-400">
          Find Clash Royale decks you can actually build. Select your arena,
          filter by cards you own, and copy deck links to import directly into the game.
        </p>
      </section>

      <section className="mb-10">
        <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Find Decks You Can Actually Build
          </h2>
          <p className="text-gray-300 mb-4 max-w-lg mx-auto">
            Select your arena, check the cards you own, and instantly see which
            winning decks are available to you right now. Your selections are
            saved automatically.
          </p>
          <p className="text-yellow-400 font-medium">
            Pick your arena below to get started
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Popular Arenas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/arena/arena-15"
            className="bg-gray-800 border border-yellow-500 rounded-lg p-4 hover:bg-gray-750 transition-colors"
          >
            <div className="text-yellow-400 font-bold text-lg">Arena 15: Miner&apos;s Mine</div>
            <p className="text-gray-400 text-sm mt-1">
              5000+ trophies. Electro Giant unlocks here with an 80% win rate deck.
              See the best Arena 15 decks →
            </p>
          </Link>
          <Link
            href="/arena/arena-19"
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition-colors"
          >
            <div className="text-yellow-400 font-bold text-lg">Arena 19: Dragon Spa</div>
            <p className="text-gray-400 text-sm mt-1">
              7000+ trophies. Full card pool with 79 viable builds.
              See the best Arena 19 decks →
            </p>
          </Link>
          <Link
            href="/arena/arena-17"
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition-colors"
          >
            <div className="text-yellow-400 font-bold text-lg">Arena 17: Royal Crypt</div>
            <p className="text-gray-400 text-sm mt-1">
              6000+ trophies. Zap overtakes Fireball as the meta shifts.
              See the best Arena 17 decks →
            </p>
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Select Your Arena</h2>
        <ArenaList />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">1. Pick Your Arena</div>
            <p className="text-gray-400 text-sm">
              Select the arena you&apos;re currently in. We cover all 20 arenas from
              Goblin Stadium to Legendary Arena.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">2. Select Your Cards</div>
            <p className="text-gray-400 text-sm">
              Check the cards you own from the interactive card grid. Your
              selections are saved automatically — no account needed.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">3. Find Your Decks</div>
            <p className="text-gray-400 text-sm">
              Instantly see decks you can build now, decks missing just 1 card,
              and decks missing 2 cards. Copy any deck link to import it into the game.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">20</div>
            <div className="text-gray-400 text-sm">Arenas Covered</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">200+</div>
            <div className="text-gray-400 text-sm">Curated Decks</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">15</div>
            <div className="text-gray-400 text-sm">Popular Cards</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-gray-400 text-sm">Free to Use</div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">How We Rank Decks</h2>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-gray-400 text-sm leading-relaxed space-y-2">
          <p>
            Deck rankings are based on real match data from the official Clash Royale API, covering thousands of battles across all arenas. Each deck is scored by combining win rate and usage rate — a deck needs to perform well <em>and</em> be played frequently to rank highly.
          </p>
          <p>
            To avoid fluky results from too few games, we apply a Bayesian average: a deck with only a handful of matches won&apos;t outrank a proven meta choice just because of an early lucky streak. This keeps the rankings stable and reflective of how decks actually perform across thousands of matches.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {HOME_FAQS.map((faq, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">{faq.question}</h3>
              <p className="text-gray-400 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
