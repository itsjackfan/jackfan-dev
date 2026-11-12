import Link from "next/link";
import { BackToTop } from "./BackToTop";

type PostRef = { slug: string; title: string } | null;

const LINK = "text-sm text-ink-muted transition-colors hover:text-ink";

export function BlogPostNavigation({ prevPost, nextPost }: { prevPost: PostRef; nextPost: PostRef }) {
  return (
    <nav className="mt-16 grid grid-cols-3 items-center gap-2 border-t border-line pt-8">
      <div>
        {prevPost && (
          <Link href={`/blog/${prevPost.slug}`} className={LINK}>
            ← Previous
          </Link>
        )}
      </div>
      <div className="flex justify-center">
        <BackToTop className={LINK} />
      </div>
      <div className="flex justify-end">
        {nextPost && (
          <Link href={`/blog/${nextPost.slug}`} className={LINK}>
            Next →
          </Link>
        )}
      </div>
    </nav>
  );
}
