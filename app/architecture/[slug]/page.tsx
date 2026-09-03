import { notFound } from "next/navigation";
import {
  architecture,
  ArchitectureSlug,
} from "@/content/architecture/manifest";
import { mdxComponents } from "@/content/mdx-components";
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
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-6 py-24">
          Loading…
        </div>
      }
    >
      <ArchitectureContent params={params} />
    </Suspense>
  );
}

async function ArchitectureContent({
  params,
}: {
  params: Promise<{ slug: ArchitectureSlug }>;
}) {
  const { slug } = await params;

  const loader = architecture[slug];

  if (!loader) {
    return notFound();
  }

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

      <article className="prose-vault max-w-none">
        <Content components={mdxComponents} />
      </article>
    </main>
  );
}