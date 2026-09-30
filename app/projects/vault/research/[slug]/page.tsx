import Link from "next/link";
import { notFound } from "next/navigation";

import {
  research,
  type ResearchSlug,
} from "@/content/projects/vault/research/manifest";

import { researchMeta } from "@/content/projects/vault/research/meta";

import DocumentFooter from "@/components/DocumentFooter";
import { getRelatedWork } from "@/content/related-work";
export function generateStaticParams() {
  return researchMeta.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ResearchDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in research)) {
    notFound();
  }

  const loadDocument = research[slug as ResearchSlug];
  const module = await loadDocument();
  const ResearchDocument = module.default;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">

      <article className="prose prose-invert max-w-none">
        <ResearchDocument />
      </article>

      <section className="not-prose mt-16 border-t border-neutral-800 pt-8">
        <Link
          href="/projects/vault/research"
          className="text-neutral-400 hover:text-white transition"
        >
          &larr; Back to Research
        </Link>
      </section>


      <DocumentFooter related={getRelatedWork("research", slug)} />
    </main>
  );
}