import type { Metadata } from 'next';
import { getBlogPosts, getAllTags } from '@/lib/blog';
import { tagSlug } from '@/lib/slug';
import { PageShell } from '@/components/ui/PageShell';
import { SmartLink } from '@/components/ui/SmartLink';
import { Tag } from '@/components/ui/Tag';
import { PostItem } from '@/components/blog/PostItem';

export async function generateStaticParams() {
  return [{ tag: 'all' }, ...getAllTags().map((tag) => ({ tag: tagSlug(tag) }))];
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const displayTag = tag === 'all' ? 'All Posts' : tag.replace(/-/g, ' ');
  return {
    title: `${displayTag} | The Main Planter`,
    description: `Blog posts tagged with ${displayTag}`,
  };
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const active = tagSlug((await params).tag);
  const posts = getBlogPosts().filter((post) => active === 'all' || post.tags?.some((t) => tagSlug(t) === active));

  const subtitle = (
    <>
      Follow on <SmartLink href="https://ustilonatus340233.substack.com">Substack</SmartLink> and{' '}
      <SmartLink href="https://linkedin.com/in/jack-fan-dev">LinkedIn</SmartLink>
      <nav className="mt-5 flex flex-wrap gap-1.5">
        <Tag href="/blog/tag/all" active={active === 'all'}>
          All
        </Tag>
        {getAllTags().map((tag) => (
          <Tag key={tag} href={`/blog/tag/${tagSlug(tag)}`} active={tagSlug(tag) === active}>
            {tag}
          </Tag>
        ))}
      </nav>
    </>
  );

  return (
    <PageShell title="The Main Planter" scene="planter" subtitle={subtitle}>
      <div className="max-w-page">
        {posts.length === 0 ? (
          <p className="text-meta py-16 text-center">No posts found for this tag.</p>
        ) : (
          posts.map((post) => <PostItem key={post.slug} post={post} />)
        )}
      </div>
    </PageShell>
  );
}
