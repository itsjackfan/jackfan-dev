import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts, getAllTags } from "@/lib/blog";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BlogPostItemProps = {
  post: {
    slug: string;
    title: string;
    date: string;
    author: string;
    tags?: string[];
    externalUrl?: string;
  };
};

function BlogPostItem({ post }: BlogPostItemProps) {
  const isExternal = !!post.externalUrl;
  const href = isExternal ? post.externalUrl! : `/blog/${post.slug}`;
  const favicon = isExternal
    ? `https://www.google.com/s2/favicons?domain=${new URL(post.externalUrl!).hostname}&sz=32`
    : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:bg-gray-50 transition-colors mb-3">
      <Link
        href={href}
        className="block"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <div className="space-y-2">
          <h2 className="flex items-center gap-2 text-base md:text-lg font-medium text-gray-900 transition-colors hover:text-gray-700">
            {favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favicon}
                alt=""
                width={16}
                height={16}
                className="rounded-sm shrink-0"
              />
            )}
            {post.title}
          </h2>
        </div>
      </Link>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {post.tags.map((tag) => {
            const tagSlug = tag.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link
                key={tag}
                href={`/blog/tag/${tagSlug}`}
                className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                  tag.toLowerCase() === "external"
                    ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tag}
              </Link>
            );
          })}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-2">
        {post.date}
        {post.author && ` · ${post.author}`}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return [
    { tag: "all" },
    ...tags.map((tag) => ({ tag: tag.toLowerCase().replace(/\s+/g, "-") })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const displayTag = tag === "all" ? "All Posts" : tag.replace(/-/g, " ");
  
  return {
    title: `${displayTag} | The Main Planter`,
    description: `Blog posts tagged with ${displayTag}`,
  };
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const allPosts = getBlogPosts();
  const allTags = getAllTags();

  // Normalize tag for comparison
  const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");
  
  // Filter posts
  const filteredPosts =
    normalizedTag === "all"
      ? allPosts
      : allPosts.filter((post) =>
          post.tags?.some((postTag) =>
            postTag.toLowerCase().replace(/\s+/g, "-") === normalizedTag
          )
        );

  // Get display name for the tag
  const displayTag =
    normalizedTag === "all"
      ? "All Posts"
      : allTags.find(
          (t) => t.toLowerCase().replace(/\s+/g, "-") === normalizedTag
        ) || tag.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-white px-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl py-24">
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to home</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="sticky top-24">
              <h1 className="text-2xl md:text-3xl font-normal text-gray-900 mb-1 leading-tight">
                The Main Planter <span className="text-gray-400">/</span> {displayTag}
              </h1>
              <nav className="flex flex-col gap-0 mt-4">
                <Link
                  href="/blog/tag/all"
                  className={`px-2 py-1 rounded-md text-sm transition-colors ${
                    normalizedTag === "all"
                      ? "text-white bg-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  All Posts
                </Link>
                {allTags.map((tagOption) => {
                  const tagSlug = tagOption.toLowerCase().replace(/\s+/g, "-");
                  const isActive = tagSlug === normalizedTag;
                  return (
                    <Link
                      key={tagOption}
                      href={`/blog/tag/${tagSlug}`}
                      className={`px-2 py-1 rounded-md text-sm transition-colors ${
                        isActive
                          ? "text-white bg-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {tagOption}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Posts Pane */}
          <section className="md:col-span-9">
            <div>
              {filteredPosts.length === 0 ? (
                <div className="text-sm text-gray-500 py-8">
                  No posts found for this tag.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredPosts.map((post) => (
                    <BlogPostItem key={post.slug} post={{
                      slug: post.slug,
                      title: post.title,
                      date: post.date,
                      author: post.author,
                      tags: post.tags,
                      externalUrl: post.externalUrl,
                    }} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

