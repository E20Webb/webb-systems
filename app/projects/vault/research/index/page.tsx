import Link from "next/link";
import { researchMeta } from "@/content/projects/vault/research/meta";

export default function ResearchIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-20 space-y-12">

      {/* RESEARCH INTRO */}
      <section className="not-prose space-y-5">
        <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
          Vault Research
        </p>

        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
          Research
        </h1>

        <p className="text-lg text-neutral-300 leading-relaxed">
          Independent analysis of the economic, cultural, and technical
          conditions behind the systems in this Vault.
        </p>

        <p className="text-neutral-400 leading-relaxed">
          These pieces examine the structures, incentives, behaviors, and
          constraints shaping technology, gaming, and digital platforms.
          They are not project summaries. They establish the underlying
          problems, economics, and strategic conditions from which larger
          architectural responses can emerge.
        </p>
      </section>

      {/* RESEARCH LIST */}
      <section className="border-t border-neutral-800 pt-10">
        <ul className="space-y-10 md:space-y-12">
          {researchMeta.map((item) => (
            <li
              key={item.slug}
              className="border-b border-neutral-800 pb-10 md:pb-12"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-3">
                {item.category}
              </p>

              <Link
                href={`/projects/vault/research/${item.slug}`}
                className="group"
              >
                <h2 className="text-xl md:text-2xl font-medium text-white group-hover:underline underline-offset-4">
                  {item.title}
                </h2>
              </Link>

              <p className="mt-3 text-neutral-400 leading-relaxed">
                {item.abstract}
              </p>

              <Link
                href={`/projects/vault/research/${item.slug}`}
                className="inline-block mt-4 text-sm text-green-400 hover:text-green-300 transition"
              >
                Read Research &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* VAULT RETURN */}
      <section className="border-t border-neutral-800 pt-8">
        <Link
          href="/projects/vault/index"
          className="text-neutral-400 hover:text-white transition"
        >
          &larr; Back to Vault
        </Link>
      </section>

    </main>
  );
}