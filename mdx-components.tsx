import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image"; // ⭐ REQUIRED for MDX <Image>

export const MyCode = (props: any) => (
  <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto my-6">
    <code {...props} />
  </pre>
);

export const MyInlineCode = (props: any) => (
  <code className="bg-black/40 px-1 py-0.5 rounded" {...props} />
);

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    a: (props: any) => {
      if (!props.href) throw new Error("href is required");
      return <Link {...props} />;
    },

    // ⭐ MDX now knows how to render <Image>
    Image,

    // ⭐ CodeHike injects these
    MyCode,
    MyInlineCode,
  };
}
