import Link from "next/link";
import { xboxDocuments } from "@/content/projects/vault/xbox-forever/meta";

export default function XboxForeverIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* PROJECT INTRO */}
      <section className="not-prose mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Xbox Forever — Project Overview
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          Xbox Forever is a unified, intelligent platform layer that sits above individual
          games and turns Xbox into the home where discovery, culture, identity, creators,
          and competition all connect and compound together. It reframes Xbox not as a
          storefront or launcher, but as the connective tissue of modern play — a system
          that amplifies the worlds players already inhabit rather than competing with them.
        </p>

        <p className="text-gray-400 leading-relaxed">
          Built on lessons learned from Steam and the broader PC ecosystem, Xbox Forever is
          designed to make Xbox the most compelling platform to play video games on both PC
          and console. It strengthens the platform layer that modern games have eroded,
          restoring the cultural relevance, economic leverage, and ecosystem coherence that
          once defined console gaming.
        </p>

        <p className="text-gray-400 leading-relaxed">
          This page contains the strategic vision and architectural foundation for Xbox
          Forever — outlining how the platform evolves, how it creates value, and how it
          becomes the place where the biggest worlds in gaming connect.
        </p>

        <p className="text-gray-400 leading-relaxed">
          Note: This page presents the high-level vision for Xbox Forever. Detailed specifications for platform systems — including Ad Revenue, Subscription design, and other economic components — are part of the NDA documentation and are not shown here.
        </p>

      </section>

      {/* DOCUMENT LIST */}
      <h1 className="text-3xl md:text-4xl font-medium mb-6 md:mb-8">
        Xbox Forever Documents
      </h1>

      <ul className="space-y-8 md:space-y-12">
        {xboxDocuments.map((doc) => (
          <li key={doc.slug} className="border-b pb-6">
            <h2 className="text-xl md:text-2xl font-semibold">{doc.title}</h2>

            <p className="text-neutral-600 mt-2 text-base md:text-lg">
              {doc.abstract}
            </p>

            <div className="mt-4 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <Link
                href={`/projects/vault/xbox-forever/${doc.slug}`}
                className="text-green-400 hover:text-green-300 underline"
              >
                Read Web Version
              </Link>

              {doc.pdf && (
                <a
                  href={doc.pdf}
                  download
                  className="text-green-400 hover:text-green-300 underline"
                >
                  Download PDF
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
