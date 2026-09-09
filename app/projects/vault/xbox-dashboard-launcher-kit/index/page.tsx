import Link from "next/link";
import { dashboardLauncherKitDocuments } from "@/content/projects/vault/xbox-dashboard-launcher-kit/meta";

export default function XboxDashboardLauncherKitIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* PROJECT INTRO */}
      <section className="not-prose mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Dashboard Launcher Kit — Project Overview
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          The Dashboard Launcher Kit is a lightweight, modular layer for
          introducing new pages, formats, and player experiences inside the
          existing Xbox dashboard. It allows Home to evolve faster while
          preserving familiar navigation and platform stability.
        </p>

        <p className="text-gray-400 leading-relaxed">
          Reusable page structures, shared navigation rules, and controlled
          deployment let teams update individual surfaces without redesigning
          the underlying shell. Discovery, community, entertainment, and
          commerce experiences can evolve independently while retaining
          consistent platform behavior.
        </p>

        <p className="text-gray-400 leading-relaxed">
          The Launcher Kit delivers immediate infrastructure value while
          establishing a modular surface layer for future discovery,
          competition, creator, and live experiences. This creates a practical
          first step toward the broader Xbox Forever platform vision.
        </p>

        <p className="text-gray-400 leading-relaxed">
          Note: This page presents an NDA-safe overview of the Dashboard
          Launcher Kit. Detailed architectural and implementation materials are
          available through direct conversation under NDA.
        </p>
      </section>

      {/* DOCUMENT LIST */}
      <h1 className="text-3xl md:text-4xl font-medium mb-6 md:mb-8">
        Dashboard Launcher Kit Documents
      </h1>

      <ul className="space-y-8 md:space-y-12">
        {dashboardLauncherKitDocuments.map((doc) => (
          <li key={doc.slug} className="border-b pb-6">
            <h2 className="text-xl md:text-2xl font-semibold">
              {doc.title}
            </h2>

            <p className="text-neutral-400 mt-2 text-base md:text-lg">
              {doc.abstract}
            </p>

            <div className="mt-4 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <Link
                href={`/projects/vault/xbox-dashboard-launcher-kit/${doc.slug}`}
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