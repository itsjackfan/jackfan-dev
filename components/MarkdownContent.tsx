import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { AgenticExecutionLoopFigure } from "@/components/blog/AgenticExecutionLoopFigure";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { DecisionBoundaryViz } from "@/components/blog/DecisionBoundaryViz";
import { SmartLink } from "@/components/ui/SmartLink";

type Props = { children?: ReactNode; id?: string };

// rehype-slug sets heading ids; scroll-mt keeps them clear of the viewport top.
const components = {
  h2: ({ children, id }: Props) => (
    <h2 id={id} className="text-heading mb-4 mt-8 scroll-mt-20 text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children, id }: Props) => (
    <h3 id={id} className="text-heading mb-4 mt-6 scroll-mt-20">
      {children}
    </h3>
  ),
  p: ({ children }: Props) => <p className="mb-6 leading-relaxed text-ink-body">{children}</p>,
  ul: ({ children }: Props) => <ul className="mb-4 list-disc space-y-1 pl-5 text-ink-body">{children}</ul>,
  ol: ({ children }: Props) => <ol className="mb-4 list-decimal space-y-1 pl-5 text-ink-body">{children}</ol>,
  blockquote: ({ children }: Props) => (
    <blockquote className="mb-4 mt-6 border-l-2 border-ink-faint pl-6 text-ink-body">{children}</blockquote>
  ),
  hr: () => <hr className="my-12 border-line" />,
  a: ({ href, children }: Props & { href?: string }) =>
    href ? <SmartLink href={href}>{children}</SmartLink> : <span className="link">{children}</span>,
  AgenticExecutionLoopFigure,
  ArticleSidebar,
  DecisionBoundaryViz,
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <MDXRemote
      source={content}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          format: "mdx",
          remarkPlugins: [remarkToc, remarkMath],
          rehypePlugins: [rehypeSlug, rehypeKatex],
        },
      }}
      components={components}
    />
  );
}
