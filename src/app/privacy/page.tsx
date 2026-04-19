import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for CR Deck Builder",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-gray-300">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last updated: April 19, 2026</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Overview</h2>
        <p>
          CR Deck Builder ("we", "us", or "our") operates crdeckbuilder.top. This page
          explains what information we collect when you visit our site and how we use it.
          We do not sell or share your personal data with third parties for marketing purposes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
        <p>
          We do not collect any personally identifiable information directly. However, we use
          third-party analytics tools that automatically collect certain data when you visit
          our site:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Browser type and version</li>
          <li>Device type (desktop, mobile, tablet)</li>
          <li>Country and approximate region</li>
          <li>Pages visited and time spent on each page</li>
          <li>Referring website (how you found us)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Analytics Tools</h2>

        <h3 className="text-lg font-medium text-yellow-400">Google Analytics 4</h3>
        <p>
          We use Google Analytics 4 to understand how visitors interact with our site.
          Google Analytics collects usage data via cookies and similar technologies.
          You can opt out by installing the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            className="text-yellow-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          . For more information, see{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-yellow-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </p>

        <h3 className="text-lg font-medium text-yellow-400">Microsoft Clarity</h3>
        <p>
          We use Microsoft Clarity to analyze user behavior through heatmaps and session
          recordings. Clarity may record mouse movements, clicks, and scrolling. No
          personally identifiable information is captured. For more information, see{" "}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            className="text-yellow-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft&apos;s Privacy Statement
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Advertising</h2>
        <p>
          We use Google AdSense to display ads on our site. Google and its
          advertising partners may use cookies to serve ads based on your
          prior visits to this site or other websites. Google&apos;s use of
          advertising cookies enables it and its partners to serve ads based
          on your visit to this site and/or other sites on the Internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="text-yellow-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          . Alternatively, you can opt out of third-party cookies for
          personalized advertising by visiting{" "}
          <a
            href="https://www.aboutads.info/choices/"
            className="text-yellow-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.aboutads.info
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Cookies</h2>
        <p>
          Our site uses cookies placed by Google Analytics, Microsoft Clarity,
          and Google AdSense. These cookies are used for analytics, user
          experience research, and serving relevant advertisements. Third-party
          vendors, including Google, use cookies to serve ads based on your
          prior visits to this website or other websites. You can disable
          cookies in your browser settings or opt out of personalized
          advertising as described above.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Third-Party Links</h2>
        <p>
          Our site may contain links to external websites. We are not responsible for
          the privacy practices of those sites and encourage you to review their
          privacy policies.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Children&apos;s Privacy</h2>
        <p>
          Our site is not directed at children under 13. We do not knowingly collect
          personal information from children.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted
          on this page with an updated date.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
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
