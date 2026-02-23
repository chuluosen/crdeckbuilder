import { ArenaList } from "@/components/ArenaList";
import { buildWebSiteSchema, buildBreadcrumbSchema } from "@/lib/jsonld";

export default function Home() {
  const websiteSchema = buildWebSiteSchema();
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Home", path: "/" }]);

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
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Clash Royale Deck Builder
        </h1>
        <p className="text-gray-400">
          Find the best decks for every arena. Choose your arena below to see
          top-performing decks with win rates and usage stats.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Select Your Arena</h2>
        <ArenaList />
      </section>
    </>
  );
}
