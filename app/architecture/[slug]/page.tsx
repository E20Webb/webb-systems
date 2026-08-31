import { notFound } from "next/navigation";
import { architecture, ArchitectureSlug } from "@/content/architecture/manifest";

export function generateStaticParams() {
  return Object.keys(architecture).map((slug) => ({ slug }));
}

export default async function ArchitecturePage({
  params,
}: {
  params: { slug: ArchitectureSlug };
}) {
  const { slug } = params;

  const loader = architecture[slug];
  if (!loader) return notFound();

  const mod = await loader();
  const Content = mod.default;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-8">
      {mod.title && (
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
          {mod.title}
        </h1>
      )}

      {mod.date && (
        <p className="text-neutral-500 text-sm md:text-base">
          {mod.date} • {mod.readingTime}
        </p>
      )}

      <article className="prose prose-invert max-w-none text-neutral-300">
        <Content />
      </article>
    </main>
  );
}
