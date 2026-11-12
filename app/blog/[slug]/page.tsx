import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPost, getInternalBlogPosts } from "@/lib/blog";
import { MarkdownContent } from "@/components/MarkdownContent";
import { TableOfContents } from "@/components/TableOfContents";
import { BlogPostNavigation } from "@/components/BlogPostNavigation";
import { extractToc } from "@/lib/toc";
import { tagSlug } from "@/lib/slug";
import { PageShell } from "@/components/ui/PageShell";
import { Tag } from "@/components/ui/Tag";
import { Dot } from "@/components/ui/Dot";

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

  const subtitle = (
    <>
      {post.isDraft && (
        <div className="mb-3 inline-block rounded border border-yellow-300/40 bg-yellow-300/10 px-3 py-1.5 text-sm text-yellow-200">
          Draft - Not Published
        </div>
      )}
      <div className="flex items-center gap-3 text-xs">
        <time>{post.date}</time>
        {post.author && (
          <>
            <Dot />
            <span>{post.author}</span>
          </>
        )}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Tag key={tag} href={`/blog/tag/${tagSlug(tag)}`}>
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </>
  );

  return (
    <PageShell title={post.title} scene="planter" subtitle={subtitle} back={{ href: "/blog/tag/all", label: "Blog" }}>
      <div className="flex items-start gap-12">
        <div className="min-w-0 max-w-prose flex-1">
          <article>
            <MarkdownContent content={post.content} />
          </article>
          <BlogPostNavigation
            prevPost={prevPost ? { slug: prevPost.slug, title: prevPost.title } : null}
            nextPost={nextPost ? { slug: nextPost.slug, title: nextPost.title } : null}
          />
        </div>
        {toc.length > 0 && (
          <div className="sticky top-0 hidden shrink-0 lg:block">
            <TableOfContents items={toc} />
          </div>
        )}
      </div>
    </PageShell>
  );
}
