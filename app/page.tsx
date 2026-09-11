import Link from "next/link";
import { essayMeta } from "@/content/essays/meta";
import { architectureMeta } from "@/content/architecture/meta";
import Thumbnail from "../components/Thumbnail";

const featuredSelections = [
  {
    type: "essay",
    slug: "future-isnt-lost-its-underbuilt",
  },
  {
    type: "essay",
    slug: "gaming-culture",
  },
  {
    type: "architecture",
    slug: "discord-server-era",
  },
  {
    type: "essay",
    slug: "gaming-profits",
  },
  {
    type: "architecture",
    slug: "advertising-mode-problem-architecture",
  },
  {
    type: "architecture",
    slug: "post-launch-architecture",
  },
] as const;

const featuredWork = featuredSelections.map((selection) => {
  const source =
    selection.type === "essay" ? essayMeta : architectureMeta;

  const item = source.find(
    (entry) => entry.slug === selection.slug
  );

  if (!item) {
    throw new Error(
      `Featured ${selection.type} not found: ${selection.slug}`
    );
  }

  return {
    ...item,
    type: selection.type === "essay" ? "Essay" : "Architecture",
    href:
      selection.type === "essay"
        ? `/essays/${selection.slug}`
        : `/architecture/${selection.slug}`,
  };
});

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 pt-2 pb-16 md:pb-24">

      {/* Slim Motion Arrow Banner */}
      <div className="mb-8 md:mb-16 flex justify-center">
        <video
          src="/banners/home-arrow-banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-20 md:w-24 h-auto block"
        />
      </div>

      {/* Homepage Identity Block */}
      <div className="not-prose mb-12 md:mb-20 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Culture, Systems, and the Architecture of Future Worlds
        </h1>

        <div className="text-lg md:text-xl text-neutral-400 mt-2 tracking-tight">
          A unified body of work exploring the foundations, pipelines, and
          worldmaking principles shaping the future of interactive worlds.
        </div>
      </div>

      {/* Selected Work */}
      <section>
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-8 md:mb-10">
          Selected Work
        </p>

        <div className="space-y-12 md:space-y-20">
          {featuredWork.map((item) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.href}
              className="group block"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-10">

                {/* Thumbnail */}
                <div className="shrink-0 w-full h-48 md:w-56 md:h-36">
                  <Thumbnail
                    image={item.thumbnail}
                    video={item.thumbnailMotion}
                    alt={item.title}
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    {item.type}
                  </p>

                  <h2 className="text-3xl font-medium text-white group-hover:underline underline-offset-4">
                    {item.title}
                  </h2>

                  <p className="text-neutral-400 mt-3 leading-relaxed max-w-prose">
                    {item.abstract}
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Homepage Tiles */}
      <section className="mt-20 md:mt-32 border-t border-neutral-800 pt-12 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Essays Tile */}
          <Link
            href="/essays"
            className="group block border border-neutral-800 rounded-lg p-6 md:p-10
                       hover:bg-neutral-900 transition"
          >
            <h3 className="text-xl md:text-2xl font-medium text-white group-hover:underline underline-offset-4">
              Essays
            </h3>

            <p className="text-neutral-500 mt-3">
              Cultural analysis, systems thinking, and the future of games.
            </p>
          </Link>

          {/* Architecture Tile */}
          <Link
            href="/architecture"
            className="group block border border-neutral-800 rounded-lg p-6 md:p-10
                       hover:bg-neutral-900 transition"
          >
            <h3 className="text-xl md:text-2xl font-medium text-white group-hover:underline underline-offset-4">
              Architecture
            </h3>

            <p className="text-neutral-500 mt-3">
              Conceptual frameworks, diagrams, and industry-level models.
            </p>
          </Link>

          {/* Projects Vault Tile */}
          <Link
            href="/projects/vault"
            className="group block border border-neutral-800 rounded-lg p-6 md:p-10
                       hover:bg-neutral-900 transition"
          >
            <h3 className="text-xl md:text-2xl font-medium text-white group-hover:underline underline-offset-4">
              Projects Vault
            </h3>

            <p className="text-neutral-500 mt-3">
              Password-protected one-pagers and executive summaries.
            </p>
          </Link>

          {/* About Me Tile */}
          <Link
            href="/about"
            className="group block border border-neutral-800 rounded-lg p-6 md:p-10
                       hover:bg-neutral-900 transition"
          >
            <h3 className="text-xl md:text-2xl font-medium text-white group-hover:underline underline-offset-4">
              About Me
            </h3>

            <p className="text-neutral-500 mt-3">
              Who I am, what I build, and how to reach me.
            </p>
          </Link>

        </div>
      </section>

    </main>
  );
}