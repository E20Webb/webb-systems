import Link from "next/link";
import { forgeDocuments } from "@/content/projects/vault/forge/meta";

export default function ForgeProjectPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-12">

      {/* PROJECT INTRO */}
      <section className="not-prose mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Forge — Project Overview
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">
          Forge is a design‑time engine built to correct the structural problems that make
          modern game development slow, expensive, and unpredictable. It provides deterministic
          behavior modeling, designer‑first iteration, and engine‑agnostic world coherence —
          enabling teams to build complex systems without losing clarity or control.
        </p>

        <p className="text-gray-400 leading-relaxed">
          This page contains the high‑level vision document and the architectural brief.
          Together, these documents outline Forge’s purpose, its commercial strategy, its
          technical foundations, and the structural correction it introduces to modern game
          development.
        </p>
      </section>

      {/* DOCUMENT LIST */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-white">
          Forge Documents
        </h2>

        {forgeDocuments.map((doc) => (
          <div key={doc.slug} className="border border-neutral-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white">{doc.title}</h3>
            <p className="text-gray-400 mt-2">{doc.description}</p>

            <div className="mt-4 flex gap-4">
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
          </div>
        ))}
      </section>

    </main>
  );
}
