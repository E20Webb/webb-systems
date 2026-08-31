import { notFound } from "next/navigation";
import { forgeDocuments } from "@/content/projects/vault/forge/meta";

export default async function ForgeViewer(props: any) {
  const slug = props.params.slug;
  const doc = forgeDocuments.find((d) => d.slug === slug);
  if (!doc) return notFound();

  const filename = doc.mdx.split("/").pop();
  const mod = await import(`@/content/projects/vault/forge/documents/${filename}`);
  const Content = mod.default;

  return (
    <main className="mx-auto max-w-3xl px-6 pt-8 md:pt-12 pb-12 md:pb-16 space-y-8">

      <article className="prose prose-vault max-w-none">
        <Content />
      </article>

      {doc.pdf && (
        <div className="mt-6 md:mt-8">
          <a
            href={doc.pdf}
            download
            className="text-green-400 hover:text-green-300 underline block"
          >
            Download PDF
          </a>

          {doc.ndaNote && (
            <p className="text-neutral-500 text-sm mt-2">
              {doc.ndaNote}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
