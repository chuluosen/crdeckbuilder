import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the CR Deck Builder team — questions, feedback, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-gray-300">
      <h1 className="text-3xl font-bold text-white">Contact Us</h1>

      <section className="space-y-2">
        <p>
          Have a question, found a bug, or want to suggest a feature? We&apos;d
          love to hear from you.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Email</h2>
        <p>
          The fastest way to reach us is by email:{" "}
          <a
            href="mailto:chuluosen4869@gmail.com"
            className="text-yellow-400 hover:underline"
          >
            chuluosen4869@gmail.com
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">What We Can Help With</h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Bug reports or broken pages</li>
          <li>Feature requests (card filters, sorting, new arenas)</li>
          <li>Data accuracy questions</li>
          <li>Partnership or collaboration inquiries</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Response Time</h2>
        <p>
          We typically respond within 48 hours. For urgent issues, please
          include &quot;URGENT&quot; in the subject line.
        </p>
      </section>
    </div>
  );
}
