"use client";

import Link from "next/link";
import { essayMeta } from "@/content/essays/meta";
import Thumbnail from "@/components/Thumbnail";

export default function EssaysIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* Cinematic Banner */}
      <div className="w-full aspect-[2.35/1] rounded-lg overflow-hidden">
        <video
          src="/banners/essays-banner.mp4"
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
          Essays
        </h1>
        <p className="text-neutral-500 text-sm md:text-base">
          Writing, analysis, and long‑form thinking.
        </p>
      </header>

      {/* Orientation */}
      <section className="space-y-6 text-neutral-300 leading-relaxed">
        <h2 className="text-lg md:text-xl font-medium">Orientation</h2>

        <p>
          These essays aren’t meant to be definitive. They’re explorations — my attempt to start
          different conversations, to follow the paths culture is revealing, to map out ideas that
          feel unfinished, and to think through the systems, stories, and transitions shaping the
          medium.
        </p>

        <p>
          Some of these pieces are personal. Some are structural. Some are architectural. All of
          them are explorations.
        </p>

        <p>
          If any of them resonate with you, I’m glad you’re here thinking through them with me.
        </p>
      </section>

      {/* Essays List */}
      <ul className="space-y-12 md:space-y-16">
        {essayMeta.map((essay) => (
          <li key={essay.slug}>
            <Link href={`/essays/${essay.slug}`} className="block group">
              <div className="aspect-[16/9] w-full pointer-events-none">
                <Thumbnail
                  image={essay.thumbnail}
                  video={essay.thumbnailMotion}
                  alt={essay.title}
                  caption={essay.abstract}
                />
              </div>
            </Link>

            <div className="mt-4 space-y-1">
              <Link
                href={`/essays/${essay.slug}`}
                className="text-xl md:text-2xl font-medium text-white hover:text-neutral-200 transition"
              >
                {essay.title}
              </Link>

              <p className="text-neutral-500 text-sm md:text-base">
                {essay.category}
              </p>

              {essay.abstract && (
                <p className="text-neutral-400 text-sm md:text-base">
                  {essay.abstract}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
