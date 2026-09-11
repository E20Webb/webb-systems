import { notFound } from "next/navigation";
import { essays, EssaySlug } from "@/content/essays/manifest";
import { getRelatedWork } from "@/content/related-work";
import DocumentFooter from "@/components/DocumentFooter";
import { Suspense } from "react";

export default function EssayPage({
  params,
}: {
  params: Promise<{ slug: EssaySlug }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-6 py-24">
          Loading…
        </div>
      }
    >
      <EssayContent params={params} />
    </Suspense>
  );
}

async function EssayContent({
  params,
}: {
  params: Promise<{ slug: EssaySlug }>;
}) {
  const { slug } = await params;

  const loader = essays[slug];
  if (!loader) return notFound();

  const mod = await loader();
  const Content = mod.default;
  const related = getRelatedWork("essay", slug);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
      <div className="space-y-8">
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
      </div>

      <DocumentFooter related={related} />
    </main>
  );
}
