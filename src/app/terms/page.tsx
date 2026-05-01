import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for CR Deck Builder, an independent Clash Royale deck recommendation tool.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-300 leading-relaxed">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: May 1, 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Acceptance of Terms</h2>
        <p>
          By using CR Deck Builder, you agree to these terms. If you do not
          agree, please do not use this website.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Independent Project</h2>
        <p>
          CR Deck Builder is an independent fan-made tool. It is not affiliated
          with, endorsed, sponsored, or approved by Supercell. Clash Royale and
          related assets are trademarks of Supercell.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Deck Data and Recommendations</h2>
        <p>
          Deck rankings, win rates, usage rates, sample sizes, and related
          recommendations are provided for informational purposes only. They are
          based on available battle data and statistical ranking methods, and may
          not reflect every trophy range, season, balance change, or player skill
          level.
        </p>
        <p>
          You are responsible for deciding whether a deck recommendation is
          suitable for your account, unlocked cards, and play style.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">No Guarantees</h2>
        <p>
          We try to keep the site useful and accurate, but we do not guarantee
          that all data, recommendations, links, or features will always be
          complete, current, or error-free.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Acceptable Use</h2>
        <p>
          Do not misuse the website, interfere with its operation, attempt to
          bypass security controls, or use it for unlawful activity.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. The updated version will
          be posted on this page with a revised date.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
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
