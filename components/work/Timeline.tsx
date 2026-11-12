import type { WorkItem } from '@/data/work-items';
import { SmartLink } from '@/components/ui/SmartLink';

function TimelineRow({ item }: { item: WorkItem }) {
  return (
    <li className="grid grid-cols-[9rem_1fr] items-baseline gap-6 text-sm leading-relaxed">
      <time className="text-meta text-right">{item.date}</time>
      <p className="min-w-0 text-ink">
        {item.link ? (
          <SmartLink href={item.link} icon>
            {item.title}
          </SmartLink>
        ) : (
          item.title
        )}
      </p>
    </li>
  );
}

export function Timeline({ items }: { items: WorkItem[] }) {
  return (
    <ol className="space-y-7">
      {items.map((item) => (
        <TimelineRow key={item.id} item={item} />
      ))}
    </ol>
  );
}
