import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
};

export function SmartLink({ href, children, className = 'link', icon = false }: Props) {
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        {icon && <ExternalLink className="ml-1 inline h-3 w-3 text-ink-muted" />}
      </a>
    );
  }
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
