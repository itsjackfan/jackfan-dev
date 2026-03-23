import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { ReactNode } from "react";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { AgenticExecutionLoopFigure } from "@/components/blog/AgenticExecutionLoopFigure";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { DecisionBoundaryViz } from "@/components/blog/DecisionBoundaryViz";

interface MarkdownContentProps {
  content: string;
  title?: string;
  date?: string;
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const components = {
  h2: ({ children, id }: { children?: ReactNode; id?: string }) => {
    const text = String(children || "");
    const headerId = id || generateId(text);
    return (
      <h2
        id={headerId}
        className="text-2xl mb-4 mt-8 scroll-mt-20"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, id }: { children?: ReactNode; id?: string }) => {
    const text = String(children);
    const headerId = id || generateId(text);
    return (
      <h3
        id={headerId}
        className="text-xl font-bold text-black mb-4 mt-6 scroll-mt-20"
      >
        {children}
      </h3>
    );
  },
  p: ({ children }: { children?: ReactNode }) => (
    <p className="text-md text-gray-700 mb-6 leading-relaxed">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="list-disc pl-5 space-y-1 mb-4">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="list-decimal pl-5 space-y-1 mb-4">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="text-md text-gray-700">
      {children}
    </li>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <div className="pl-6 border-l-2 border-gray-300 mt-6 mb-4">
      <p className="text-md text-gray-700 mt-2">
        {children}
      </p>
    </div>
  ),
  hr: () => <hr className="border my-12" />,
  AgenticExecutionLoopFigure,
  ArticleSidebar,
  DecisionBoundaryViz,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => {
    if (!href) {
      return <span className="underline hover:text-blue-700 transition-colors">{children}</span>;
    }
    
    const isExternal = href.startsWith("http");
    const isEmail = href.startsWith("mailto:");
    
    if (isExternal || isEmail) {
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="underline hover:text-blue-700 transition-colors"
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link
        href={href}
        className="underline hover:text-blue-700 transition-colors"
      >
        {children}
      </Link>
    );
  },
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <MDXRemote
      source={content}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          format: 'mdx',
          remarkPlugins: [remarkToc, remarkMath],
          rehypePlugins: [rehypeSlug, rehypeKatex],
        },
      }}
      components={components}
    />
  );
}

