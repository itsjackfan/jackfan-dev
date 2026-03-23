'use client';

import { useMemo, useState } from 'react';
import type { TimelineEntry } from '@/data/timeline-items';
import { TimelineItem } from './TimelineItem';

const FILTERS = [
  { label: '1M',  months: 1  },
  { label: '3M',  months: 3  },
  { label: '6M',  months: 6  },
  { label: '12M', months: 12 },
  { label: 'All', months: null as null },
] as const;

const EXPERIENCE_TYPES = new Set(['role', 'education']);
const OUTPUT_TYPES      = new Set(['project', 'publication', 'reading', 'workshop']);

interface TimelineViewProps {
  entries: TimelineEntry[];
}

function Section({ title, entries }: { title: string; entries: TimelineEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div>
      <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-gray-400">
        {title}
      </h2>
      <div>
        {entries.map((entry, i) => (
          <TimelineItem key={entry.id} entry={entry} isLast={i === entries.length - 1} />
        ))}
      </div>
    </div>
  );
}

export function TimelineView({ entries: rawEntries }: TimelineViewProps) {
  const [filterMonths, setFilterMonths] = useState<number | null>(null);

  const entries = useMemo(() => {
    if (filterMonths === null) return rawEntries;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - filterMonths);
    return rawEntries.filter((e) => {
      const end =
        e.endDate === 'present' ? new Date()
        : e.endDate              ? new Date(e.endDate)
        :                          new Date(e.startDate);
      return end >= cutoff;
    });
  }, [rawEntries, filterMonths]);

  const experience = useMemo(
    () => entries.filter((e) => EXPERIENCE_TYPES.has(e.type)),
    [entries]
  );
  const output = useMemo(
    () => entries.filter((e) => OUTPUT_TYPES.has(e.type)),
    [entries]
  );

  const handleFilter = (months: number | null) => {
    setFilterMonths(months);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16">
      {/* Filter pills */}
      <div className="flex items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => handleFilter(f.months)}
            className={[
              'px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer',
              filterMonths === f.months
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Section title="Experience" entries={experience} />
      <Section title="Output"     entries={output} />
    </div>
  );
}
