import type { BlogPost } from '@/lib/blog';
import { SmartLink } from '@/components/ui/SmartLink';
import { Tag } from '@/components/ui/Tag';
import { Dot } from '@/components/ui/Dot';

export function PostItem({ post }: { post: BlogPost }) {
  const href = post.externalUrl ?? `/blog/${post.slug}`;
  const favicon = post.externalUrl
    ? `https://www.google.com/s2/favicons?domain=${new URL(post.externalUrl).hostname}&sz=32`
    : null;

  return (
    <SmartLink href={href} className="group block border-b border-line py-6 last:border-b-0">
      <h2 className="flex items-center gap-2.5 text-lg leading-relaxed text-ink transition-colors group-hover:text-ink-muted">
        {favicon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={favicon} alt="" width={14} height={14} className="shrink-0 opacity-50" />
        )}
        {post.title}
      </h2>
      <div className="text-meta mt-2 flex items-center gap-3">
        <time>{post.date}</time>
        {post.tags && post.tags.length > 0 && (
          <>
            <Dot />
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </>
        )}
      </div>
    </SmartLink>
  );
}
