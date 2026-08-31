import Link from "next/link";
import { forgeDocuments } from "@/content/projects/vault/forge/meta";

export default function ForgeIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* PROJECT INTRO */}
      <section className="not-prose mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Forge — Project Overview
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          Forge is a design‑time engine built to correct the structural problems that make
          modern game development slow, expensive, and unpredictable. It provides deterministic
          behavior modeling, designer‑first iteration, and engine‑agnostic world coherence.
          Enabling teams to build complex systems without losing clarity, time, money, or control.
        </p>

        <p className="text-gray-400 leading-relaxed">
          This page contains the high‑level vision document and the architectural brief.
          Together, these documents outline Forge’s purpose, its commercial strategy, its
          technical foundations, and the structural correction it introduces to modern game
          development.
        </p>
      </section>

      {/* DOCUMENT LIST */}
      <h1 className="text-3xl md:text-4xl font-medium mb-6 md:mb-8">
        Forge Documents
      </h1>

      <ul className="space-y-8 md:space-y-12">
        {forgeDocuments.map((doc) => (
          <li key={doc.slug} className="border-b pb-6">
            <h2 className="text-xl md:text-2xl font-semibold">{doc.title}</h2>

            <p className="text-neutral-600 mt-2 text-base md:text-lg">
              {doc.abstract}
            </p>

            <div className="mt-4 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              <Link
                href={`/projects/vault/forge/${doc.slug}`}
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
