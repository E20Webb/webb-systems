import Link from "next/link";
import { xboxForeverAdsDocuments } from "@/content/projects/vault/xbox-forever-ads/meta";

export default function XboxForeverAdsIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* PROJECT INTRO */}
      <section className="not-prose mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Xbox Forever Ads — Project Overview
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          Xbox Forever Ads is a platform-native advertising, discovery, and cultural
          amplification architecture designed around a simple principle: new revenue
          should come from new modes of participation, not from degrading traditional
          games.
        </p>

        <p className="text-gray-400 leading-relaxed">
          The system explores how playable discovery, competitive spectacle, live
          culture, creators, identity, and commerce can become coordinated economic
          surfaces across the Xbox platform. Advertising follows value rather than
          interrupting it — creating new ways to monetize attention while preserving
          player trust.
        </p>

        <p className="text-gray-400 leading-relaxed">
          The architecture is designed to create value around the existing catalog
          rather than requiring games to be rebuilt around advertising. Back catalog
          titles, current games, and future releases can participate through new
          platform experiences while the games themselves remain intact.
        </p>

        <p className="text-gray-400 leading-relaxed">
          This page contains the executive and strategic material for Xbox Forever Ads.
          The deeper repository includes the underlying auction, relevance, safety,
          ranking, delivery, telemetry, attribution, creator amplification, and
          platform integration architecture.
        </p>

        <p className="text-gray-400 leading-relaxed">
          Note: Detailed system specifications, implementation contracts, scoring
          models, APIs, integration logic, and engineering documentation are part of
          the NDA architecture and are not shown here.
        </p>

      </section>

      {/* DOCUMENT LIST */}
      <h1 className="text-3xl md:text-4xl font-medium mb-6 md:mb-8">
        Xbox Forever Ads Documents
      </h1>

      <ul className="space-y-8 md:space-y-12">
        {xboxForeverAdsDocuments.map((doc) => (
          <li key={doc.slug} className="border-b pb-6">
            <h2 className="text-xl md:text-2xl font-semibold">{doc.title}</h2>

            <p className="text-neutral-600 mt-2 text-base md:text-lg">
              {doc.abstract}
            </p>

            <div className="mt-4 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <Link
                href={`/projects/vault/xbox-forever-ads/${doc.slug}`}
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