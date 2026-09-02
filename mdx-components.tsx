import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// ⭐ These names MUST match next.config.ts
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

    // ⭐ CodeHike will inject <MyCode> and <MyInlineCode>
    MyCode,
    MyInlineCode,
  };
}
