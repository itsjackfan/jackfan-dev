import Link from 'next/link';


export function Tag({ href, active = false, children }: { href?: string; active?: boolean; children: React.ReactNode }) {
  const className = active ? 'tag tag-active' : 'tag';
  if (!href) return <span className={className}>{children}</span>;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
