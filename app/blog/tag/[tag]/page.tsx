import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts, getAllTags } from "@/lib/blog";
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
    <Link
      href={href}
      className="group block py-6 border-b border-gray-100 last:border-b-0 transition-colors"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2.5 text-lg font-normal text-gray-900 group-hover:text-gray-500 transition-colors leading-relaxed">
          {favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={14}
              height={14}
              className="shrink-0 opacity-50"
            />
          )}
          <span>{post.title}</span>
        </h2>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <time className="tabular-nums">{post.date}</time>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="text-gray-200">·</span>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      tag.toLowerCase() === "external"
                        ? "bg-rose-50 text-rose-400"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
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

  const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");

  const filteredPosts =
    normalizedTag === "all"
      ? allPosts
      : allPosts.filter((post) =>
          post.tags?.some(
            (postTag) =>
              postTag.toLowerCase().replace(/\s+/g, "-") === normalizedTag
          )
        );

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="shrink-0 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl pt-24 pb-8">
          {/* Back link */}
          <Link
            href="/"
            className="group mb-14 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Home
          </Link>

          {/* Header */}
          <header>
            <h1 className="text-3xl md:text-4xl font-normal text-gray-900 leading-tight tracking-tight">
              The Main Planter
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Follow on{" "}
              <a
                href="https://ustilonatus340233.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 underline underline-offset-2 decoration-gray-200 hover:text-gray-900 hover:decoration-gray-400 transition-colors"
              >
                Substack
              </a>
              {" "}and{" "}
              <a
                href="https://linkedin.com/in/jack-fan-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 underline underline-offset-2 decoration-gray-200 hover:text-gray-900 hover:decoration-gray-400 transition-colors"
              >
                LinkedIn
              </a>
            </p>
            <nav className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
              <Link
                href="/blog/tag/all"
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  normalizedTag === "all"
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                All
              </Link>
              {allTags.map((tagOption) => {
                const tagSlug = tagOption.toLowerCase().replace(/\s+/g, "-");
                const isActive = tagSlug === normalizedTag;
                return (
                  <Link
                    key={tagOption}
                    href={`/blog/tag/${tagSlug}`}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      isActive
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tagOption}
                  </Link>
                );
              })}
            </nav>
          </header>
        </div>
      </div>

      {/* Divider */}
      <div className="shrink-0 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl border-t border-gray-100" />
      </div>

      {/* Scrollable posts area */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl pb-16">
          {filteredPosts.length === 0 ? (
            <p className="text-sm text-gray-400 py-16 text-center">
              No posts found for this tag.
            </p>
          ) : (
            <div>
              {filteredPosts.map((post) => (
                <BlogPostItem
                  key={post.slug}
                  post={{
                    slug: post.slug,
                    title: post.title,
                    date: post.date,
                    author: post.author,
                    tags: post.tags,
                    externalUrl: post.externalUrl,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
