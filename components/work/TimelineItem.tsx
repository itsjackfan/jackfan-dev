'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { TimelineEntry } from '@/data/timeline-items';

function fmtDate(d: string): string {
  if (d === 'present') return 'present';
  return new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function dateLabel(entry: TimelineEntry): React.ReactNode {
  if (!entry.endDate) return fmtDate(entry.startDate);
  return (
    <>
      {fmtDate(entry.startDate)}
      <span className="block text-gray-300">–</span>
      {fmtDate(entry.endDate)}
    </>
  );
}

interface TimelineItemProps {
  entry: TimelineEntry;
  isLast: boolean;
}

export function TimelineItem({ entry, isLast }: TimelineItemProps) {
  const isExternal = entry.link && !entry.link.startsWith('/');

  const titleEl = (
    <span className="text-base font-normal text-gray-900 leading-snug">{entry.title}</span>
  );

  // subtitle: org for roles/education; venue for publications
  const subtitle = entry.organization ?? entry.venue ?? null;

  // meta: authors (skip solo "Jack Fan" entries for projects)
  const meta =
    entry.authors && !(entry.authors.length === 1 && entry.authors[0] === 'Jack Fan')
      ? entry.authors.join(', ')
      : null;

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Date */}
      <div className="w-20 shrink-0 pt-0.5 text-right text-xs text-gray-400 leading-relaxed tabular-nums sm:w-24">
        {dateLabel(entry)}
      </div>

      {/* Spine */}
      <div className="flex flex-col items-center pt-1.5">
        <div className="h-2 w-2 shrink-0 rounded-full border border-gray-300 bg-white" />
        {!isLast && <div className="mt-1 w-px flex-1 bg-gray-100" style={{ minHeight: '2rem' }} />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-7 space-y-1">
        {entry.link ? (
          isExternal ? (
            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-1 hover:text-gray-500 transition-colors"
            >
              {titleEl}
              <ExternalLink className="mt-1 h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          ) : (
            <Link
              href={entry.link}
              className="group inline-flex items-start gap-1 hover:text-gray-500 transition-colors"
            >
              {titleEl}
              <ExternalLink className="mt-1 h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          )
        ) : (
          titleEl
        )}

        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}

        {entry.description && (
          <p className="text-sm text-gray-500 leading-relaxed">{entry.description}</p>
        )}

        {meta && (
          <p className="text-xs text-gray-400">{meta}</p>
        )}
      </div>
    </div>
  );
}
