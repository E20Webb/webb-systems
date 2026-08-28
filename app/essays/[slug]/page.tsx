import { notFound } from "next/navigation";
import { essays, EssaySlug } from "@/content/essays/manifest";
import { Suspense } from "react";

export default function EssayPage({
  params,
}: {
  params: Promise<{ slug: EssaySlug }>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-24">Loading…</div>}>
      <EssayContent params={params} />
    </Suspense>
  );
}

async function EssayContent({
  params,
}: {
  params: Promise<{ slug: EssaySlug }>;
}) {
  const { slug } = await params; // ✔ allowed inside Suspense

  const loader = essays[slug];
  if (!loader) return notFound();

  const mod = await loader();
  const Content = mod.default;

  return (
<main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-8">

  {/* Optional: Title from manifest */}
  {mod.title && (
    <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
      {mod.title}
    </h1>
  )}

  {/* Optional: Metadata */}
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