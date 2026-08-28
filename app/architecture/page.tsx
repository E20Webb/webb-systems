"use client";

import Link from "next/link";
import { architectureMeta } from "@/content/architecture/meta";
import Thumbnail from "@/components/Thumbnail";

export default function ArchitectureIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* Cinematic Banner */}
      <div className="w-full aspect-[2.35/1] rounded-lg overflow-hidden">
        <video
          src="/banners/architecture-banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Page Title */}
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
          Architecture
        </h1>
        <p className="text-neutral-500 text-sm md:text-base">
          Systems, pipelines, frameworks, and conceptual models.
        </p>
      </header>

      {/* Orientation */}
      <section className="space-y-6 text-neutral-300 leading-relaxed">
        <h2 className="text-lg md:text-xl font-medium">Orientation</h2>

        <p>
          These architectural pieces are different from the essays. They’re more structured, more
          technical, and more focused on systems design. They explore pipelines, frameworks,
          conceptual models, and the underlying mechanics that shape how complex projects are built.
        </p>

        <p>
          Some of these documents include diagrams, JSON structures, component maps, and
          multi‑layered frameworks. They’re meant to be read slowly — not as declarations, but as
          working blueprints.
        </p>

        <p>
          None of these architectures are final. They’re living documents, evolving as the medium
          evolves. They’re here to map possibilities, clarify foundations, and explore how better
          systems might be built.
        </p>
      </section>

      {/* Architecture List */}
      <ul className="space-y-12 md:space-y-16">
        {architectureMeta.map((item) => (
          <li key={item.slug}>
            <Link href={`/architecture/${item.slug}`} className="block group">
              <div className="aspect-[16/9] w-full pointer-events-none">
                <Thumbnail
                  image={item.thumbnail}
                  video={item.thumbnailMotion}
                  alt={item.title}
                  caption={item.abstract}
                />
              </div>
            </Link>

            <div className="mt-4 space-y-1">
              <Link
                href={`/architecture/${item.slug}`}
                className="text-xl md:text-2xl font-medium text-white hover:text-neutral-200 transition"
              >
                {item.title}
              </Link>

              <p className="text-neutral-500 text-sm md:text-base">
                {item.category}
              </p>

              {item.abstract && (
                <p className="text-neutral-400 text-sm md:text-base">
                  {item.abstract}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
