import { notFound } from "next/navigation";
import { ncDocuments } from "@/content/projects/vault/nc-foundation/meta";

export default async function Page(props: any) {
  const slug = props.params.slug;

  const doc = ncDocuments.find((d) => d.slug === slug);
  if (!doc) return notFound();

  const filename = doc.mdx.split("/").pop();
  const mod = await import(
    `@/content/projects/vault/nc-foundation/documents/${filename}`
  );
  const Content = mod.default;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-8">
      <article className="prose prose-vault max-w-none">
        <Content />
      </article>

      {doc.pdf && (
        <a
          href={doc.pdf}
          download
          className="text-green-400 hover:text-green-300 underline block mt-6 md:mt-8"
        >
          Download PDF
        </a>
      )}
    </main>
  );
}
