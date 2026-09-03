"use client";

import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";

export default function VaultIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-6 pb-16 md:pb-24 space-y-12 md:space-y-16">
      <h1 className="text-3xl md:text-4xl font-medium mb-8 md:mb-10">Vault</h1>

      {/* Orientation */}
      <section className="space-y-6 text-neutral-300 leading-relaxed">
        <h2 className="text-lg md:text-xl font-medium">Orientation</h2>

        <p>
          This vault contains foundational documents from Xbox Forever, Forge, and the NC Framework.
          These are not marketing materials — they are structural artifacts. Each one describes a
          component of a larger architecture, built to be read, inspected, and understood at a
          systems level.
        </p>

        <p>
          Many of these documents map directly to a working repository. The full architecture already
          exists in code — complete enough to open in VS Code, explore, and begin engineering against.
          The vault is the narrative layer that explains how those systems fit together.
        </p>

        <p>
          These documents are provided for private review only. They are living foundations, meant to
          clarify structure, preserve intent, and support the work of anyone building on top of the
          architecture.
        </p>
      </section>

      {/* Sovereign Seal */}
      <section className="pt-4">
        <div className="flex items-center gap-4">
          <img
            src="/site-icons/web-systems-seal.png"
            alt="Web Systems Seal"
            className="w-40 md:w-56 h-auto opacity-90"
          />
          <span className="text-neutral-400 uppercase tracking-wide text-sm">
            Restricted Access
          </span>
        </div>
      </section>

      {/* Document Classes */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-medium">Document Classes</h2>
        <ul className="list-disc list-inside text-neutral-300 space-y-1">
          <li>One‑Pagers</li>
          <li>Executive Briefs</li>
          <li>Architecture Notes</li>
          <li>Strategic Addenda</li>
        </ul>
      </section>

      {/* Last Updated */}
      <section>
        <p className="text-neutral-500 text-sm">Last Updated: July 2026</p>
      </section>

      {/* Request Full Access */}
      <section className="space-y-2">
        <h2 className="text-lg md:text-xl font-medium">Request Full Access</h2>
        <p className="text-neutral-300">
          Access to the full repository and architectural corpus requires an NDA.
        </p>
        <Link
          href="mailto:Elliott@Webb.Systems?subject=Request%20for%20Full%20Access%20(NDA%20Required)"
          className="text-blue-400 hover:underline"
        >
          Contact Elliott@Webb.Systems
        </Link>
      </section>

      {/* Existing Vault Items */}
      <ul className="space-y-12 md:space-y-16 pt-10">

        {/* Xbox Forever */}
        <li>
          <Link href="/projects/vault/xbox-forever" className="block group">
            <div className="aspect-[16/9] w-full pointer-events-none">
              <Thumbnail
                image="/thumbnails/xbox-forever.jpg"
                video="/thumbnails/xbox-forever-motion.mp4"
                alt="Xbox Forever"
                caption="The long-term platform strategy for Xbox and its ecosystem."
              />
            </div>
          </Link>

          <div className="mt-4">
            <Link
              href="/projects/vault/xbox-forever"
              className="text-xl md:text-2xl font-medium hover:underline underline-offset-4"
            >
              Xbox Forever
            </Link>

            <p className="text-neutral-500 text-sm uppercase tracking-wide mt-1">
              Platform Strategy
            </p>
          </div>
        </li>

        {/* Forge */}
        <li>
          <Link href="/projects/vault/forge" className="block group">
            <div className="aspect-[16/9] w-full pointer-events-none">
              <Thumbnail
                image="/thumbnails/forge.jpg"
                video="/thumbnails/forge-motion.mp4"
                alt="Forge"
                caption="The creative suite and pipeline architecture powering next-generation content."
              />
            </div>
          </Link>

          <div className="mt-4">
            <Link
              href="/projects/vault/forge"
              className="text-xl md:text-2xl font-medium hover:underline underline-offset-4"
            >
              Forge
            </Link>

            <p className="text-neutral-500 text-sm uppercase tracking-wide mt-1">
              Creative Pipeline
            </p>
          </div>
        </li>

        {/* NC Foundation */}
        <li>
          <Link href="/projects/vault/nc-foundation" className="block group">
            <div className="aspect-[16/9] w-full pointer-events-none">
              <Thumbnail
                image="/thumbnails/nc-foundation.jpg"
                video="/thumbnails/nc-foundation-motion.mp4"
                alt="NC Foundation"
                caption="NC—“A conceptual direction for future intelligent systems"
              />
            </div>
          </Link>

          <div className="mt-4">
            <Link
              href="/projects/vault/nc-foundation"
              className="text-xl md:text-2xl font-medium hover:underline underline-offset-4"
            >
              NC Foundation
            </Link>

            <p className="text-neutral-500 text-sm uppercase tracking-wide mt-1">
              Cognitive Architecture
            </p>
          </div>
        </li>

      </ul>
    </main>
  );
}
