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
    question: "Can I find decks for a specific card?",
    answer:
      "Yes. Each arena page has a \"Browse Decks by Card\" section where you can filter decks by popular win conditions like Hog Rider, P.E.K.K.A, Giant, Balloon, and more.",
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
          Find the best Clash Royale decks for every arena. Browse top-performing
          decks with win rates and usage stats to climb the ladder faster.
        </p>
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
            <div className="text-yellow-400 font-bold text-lg mb-1">2. Browse Top Decks</div>
            <p className="text-gray-400 text-sm">
              See the best decks for your arena ranked by win rate. Each deck shows
              card images, average elixir cost, and usage stats.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-yellow-400 font-bold text-lg mb-1">3. Filter by Card</div>
            <p className="text-gray-400 text-sm">
              Want to build around a specific card? Browse decks by popular win
              conditions like Hog Rider, P.E.K.K.A, Giant, and more.
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
