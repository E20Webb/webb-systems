import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

type AnyProps = ComponentPropsWithoutRef<any>;

const Code = (props: AnyProps) => {
  return (
    <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto my-6">
      <code {...props} />
    </pre>
  );
};

export const mdxComponents = {
  h1: (props: AnyProps) => (
    <h1
      {...props}
      className="text-4xl font-bold tracking-tight text-white mt-12 mb-6"
    />
  ),

  h2: (props: AnyProps) => (
    <h2
      {...props}
      className="text-3xl font-semibold text-white mt-16 mb-6"
    />
  ),

  h3: (props: AnyProps) => (
    <h3
      {...props}
      className="text-2xl font-semibold text-gray-200 mt-12 mb-4"
    />
  ),

  p: (props: AnyProps) => (
    <p
      {...props}
      className="text-gray-200 leading-relaxed tracking-wide my-4"
    />
  ),

  ul: (props: AnyProps) => (
    <ul
      {...props}
      className="list-disc pl-6 space-y-2 text-gray-200 my-6"
    />
  ),

  ol: (props: AnyProps) => (
    <ol
      {...props}
      className="list-decimal pl-6 space-y-2 text-gray-200 my-6"
    />
  ),

  blockquote: (props: AnyProps) => (
    <blockquote
      {...props}
      className="border-l-4 border-blue-500 pl-6 py-4 my-12 text-gray-200"
    />
  ),

  // ⭐ MDX <img> → Next.js <Image>
  img: (props: AnyProps) => {
    if (!props.src) return null;
    return (
      <Image
        src={props.src}
        alt={props.alt || ""}
        width={Number(props.width) || 1600}
        height={Number(props.height) || 900}
        className="rounded-lg w-full shadow-lg my-12"
      />
    );
  },

  // ⭐ MDX <Image> → Next.js <Image>
  Image,

  hr: () => <hr className="my-16 border-gray-700" />,

  div: (props: AnyProps) => <div {...props} />,

  code: Code,
  pre: Code,
};
