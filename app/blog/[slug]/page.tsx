import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPost, getBlogPosts, getInternalBlogPosts } from "@/lib/blog";
import { MarkdownContent } from "@/components/MarkdownContent";
import { TableOfContents } from "@/components/TableOfContents";
import { BlogPostNavigation } from "@/components/BlogPostNavigation";
import { extractToc } from "@/lib/toc";

export async function generateStaticParams() {
  const posts = getInternalBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: `${post.title} | The Main Planter`,
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const toc = extractToc(post.content);

  // Get all posts for prev/next navigation (internal only — external posts link out directly)
  const allPosts = getInternalBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white px-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl py-24">
        {/* Back to blog link at the top */}
        <Link 
          href="/blog/tag/all"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 inline-block"
        >
          ← Back to blog
        </Link>

        {/* Title/Header - centered separately */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl text-center">
            {post.isDraft && (
              <div className="mb-4 px-3 py-1.5 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800 inline-block">
                Draft - Not Published
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-col gap-2">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {post.tags.map((tag) => {
                    const tagSlug = tag.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tagSlug}`}
                        className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </Link>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">
                  {post.date}
                </span>
                {post.author && (
                  <span className="text-xs text-gray-500">
                    {post.author}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Article content - centered with TOC relative to it */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl relative">
            {/* Table of Contents Sidebar - absolutely positioned to the left of article content */}
            {toc.length > 0 && (
              <div className="hidden lg:block absolute top-0 -left-[208px] w-48">
                <TableOfContents items={toc} />
              </div>
            )}
            <article className="space-y-8">
              <div className="prose prose-sm max-w-none">
                <MarkdownContent content={post.content} />
              </div>
            </article>
          </div>
        </div>

        {/* Navigation section at the bottom */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <BlogPostNavigation
              prevPost={prevPost ? { slug: prevPost.slug, title: prevPost.title } : null}
              nextPost={nextPost ? { slug: nextPost.slug, title: nextPost.title } : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

