import Link from "next/link";

export type RelatedWorkItem = {
  type: "Essay" | "Architecture";
  title: string;
  href: string;
};

export default function DocumentFooter({
  related = [],
}: {
  related?: RelatedWorkItem[];
}) {
  return (
    <footer className="not-prose mt-24 border-t border-neutral-800 pt-10 md:pt-12">
      {related.length > 0 && (
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">
            Continue Exploring
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-lg border border-neutral-800 p-5 md:p-6 hover:bg-neutral-900 transition"
              >
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                  {item.type}
                </p>

                <p className="text-lg font-medium text-white group-hover:underline underline-offset-4">
                  {item.title} →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={`${related.length > 0 ? "mt-12 border-t border-neutral-800 pt-8" : ""} flex flex-col gap-4 md:flex-row md:items-end md:justify-between`}>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Webb Systems
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
            Essays, architecture, and systems thinking for technology, gaming,
            and culture.
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/about" className="text-neutral-400 hover:text-white transition">
            About
          </Link>

          <a href="mailto:elliott@webb.systems" className="text-neutral-400 hover:text-white transition">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
