"use client";

import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";

export default function VaultIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-6 pb-16 md:pb-24 space-y-12 md:space-y-16">
      <h1 className="text-3xl md:text-4xl font-medium mb-8 md:mb-10">
        Vault
      </h1>

      {/* Orientation */}
      <section className="space-y-6 text-neutral-300 leading-relaxed">
        <h2 className="text-lg md:text-xl font-medium">Orientation</h2>

        <p>
          This vault contains private architecture from Xbox Forever, Xbox
          Forever Ads, the Dashboard Launcher Kit, Forge, and the NC Framework
          — systems developed at different scales but through the same method:
          identify the structural constraint, separate responsibilities, and
          design the architecture that makes a different outcome possible.
        </p>

        <p>
          <strong className="text-white">Xbox Forever</strong> explores the
          platform layer around games — continuity, identity, discovery,
          community, competition, creation, and long-term ecosystem structure.
        </p>

        <p>
          <strong className="text-white">Xbox Forever Ads</strong> explores the
          economic layer around games — creating platform-native advertising,
          discovery, and cultural surfaces built around participation rather
          than interruption.
        </p>

        <p>
          <strong className="text-white">
            Dashboard Launcher Kit
          </strong>{" "}
          explores the delivery layer — a practical way to evolve Xbox Home
          while creating a path toward the broader Xbox Forever platform
          vision.
        </p>

        <p>
          <strong className="text-white">Forge</strong> addresses the production
          layer — making complex interactive systems more coherent, traceable,
          predictable, and transferable from design through runtime.
        </p>

        <p>
          <strong className="text-white">NC</strong> explores a longer-horizon
          computing problem: the governed environment persistent intelligence
          would require to operate across time, contexts, agents, and devices.
        </p>

        <p>
          These are not marketing materials. They are narrative views into
          larger systems architectures. Many of the documents map directly to
          working repositories containing the underlying models, contracts,
          structures, and implementation strategy.
        </p>

        <p>
          The material here is intentionally limited. Full repositories and
          deeper architectural documentation are available through direct
          conversation under NDA.
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
          <li>One-Pagers</li>
          <li>Executive Briefs</li>
          <li>Architecture Notes</li>
          <li>Strategic Addenda</li>
        </ul>
      </section>

      {/* Last Updated */}
      <section>
        <p className="text-neutral-500 text-sm">
          Last Updated: September 2026
        </p>
      </section>

      {/* Full Architecture */}
      <section className="space-y-2">
        <h2 className="text-lg md:text-xl font-medium">Full Architecture</h2>

        <p className="text-neutral-300">
          The complete repositories and deeper architectural corpus are
          available for serious review under NDA.
        </p>

        <Link
          href="mailto:Elliott@Webb.Systems?subject=Request%20for%20Full%20Architecture%20Access%20(NDA%20Required)"
          className="text-blue-400 hover:underline"
        >
          Contact Elliott@Webb.Systems
        </Link>
      </section>

      {/* Existing Vault Items */}
      <ul className="space-y-12 md:space-y-16 pt-10">

        {/* Xbox Forever */}
        <li>
          <Link
            href="/projects/vault/xbox-forever"
            className="block group"
          >
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

        {/* Xbox Forever Ads */}
        <li>
          <Link
            href="/projects/vault/xbox-forever-ads"
            className="block group"
          >
            <div className="aspect-[16/9] w-full pointer-events-none">
              <Thumbnail
                image="/thumbnails/xbox-forever-ads.jpg"
                video="/thumbnails/xbox-forever-ads-motion.mp4"
                alt="Xbox Forever Ads"
                caption="Monetize curiosity, not frustration."
              />
            </div>
          </Link>

          <div className="mt-4">
            <Link
              href="/projects/vault/xbox-forever-ads"
              className="text-xl md:text-2xl font-medium hover:underline underline-offset-4"
            >
              Xbox Forever Ads
            </Link>

            <p className="text-neutral-500 text-sm uppercase tracking-wide mt-1">
              Advertising Architecture
            </p>
          </div>
        </li>

        {/* Dashboard Launcher Kit */}
        <li>
          <Link
            href="/projects/vault/xbox-dashboard-launcher-kit"
            className="block group"
          >
            <div className="aspect-[16/9] w-full pointer-events-none">
              <Thumbnail
                image="/thumbnails/dashboard-launcher-kit.jpg"
                video="/thumbnails/dashboard-launcher-kit-motion.mp4"
                alt="Dashboard Launcher Kit"
                caption="A practical first step toward Xbox Forever."
              />
            </div>
          </Link>

          <div className="mt-4">
            <Link
              href="/projects/vault/xbox-dashboard-launcher-kit"
              className="text-xl md:text-2xl font-medium hover:underline underline-offset-4"
            >
              Dashboard Launcher Kit
            </Link>

            <p className="text-neutral-500 text-sm uppercase tracking-wide mt-1">
              Platform Infrastructure
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
                caption="NC — A direction for future systems"
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
          </div>
        </li>

      </ul>
    </main>
  );
}