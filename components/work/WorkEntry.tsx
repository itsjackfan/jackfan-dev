'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { WorkItem } from '@/data/work-items';

function TitleContent({ item }: { item: WorkItem }) {
  if (!item.link) return <>{item.title}</>;

  const isInternal = item.link.startsWith('/');
  const cls =
    'underline decoration-gray-300 underline-offset-2 hover:decoration-gray-500 transition-colors';
  const inner = (
    <>
      {item.title}
      <ExternalLink className="inline h-3 w-3 text-gray-400 ml-1 relative -top-px" />
    </>
  );

  if (isInternal) {
    return (
      <Link href={item.link} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}

export function WorkEntry({ item }: { item: WorkItem }) {
  return (
    <h2 className="text-sm text-gray-900 font-normal leading-relaxed">
      <TitleContent item={item} />
    </h2>
  );
}
