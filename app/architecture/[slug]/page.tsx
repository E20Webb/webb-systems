import { notFound } from "next/navigation";
import { architecture, ArchitectureSlug } from "@/content/architecture/manifest";
import { Suspense } from "react";

export function generateStaticParams() {
  return Object.keys(architecture).map((slug) => ({ slug }));
}

export default function ArchitecturePage({
  params,
}: {
  params: Promise<{ slug: ArchitectureSlug }>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-24">Loading…</div>}>
      <ArchitectureContent params={params} />
    </Suspense>
  );
}

async function ArchitectureContent({
  params,
}: {
  params: Promise<{ slug: ArchitectureSlug }>;
}) {
  const { slug } = await params; // ⭐ REQUIRED in Next.js 16.3

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

      {/* ⭐ FIXED: Use prose-vault so ASCII diagrams render correctly */}
      <article className="prose-vault max-w-none">
        <Content />
      </article>
    </main>
  );
}
