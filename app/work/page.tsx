import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllWorkItems } from '@/data/work-items';
import { WorkEntry } from '@/components/work/WorkEntry';

export default function WorkPage() {
  const items = getAllWorkItems();

  return (
    <div className="flex h-screen flex-col bg-white px-6 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-3xl shrink-0 pt-24 pb-6">
        <Link
          href="/"
          className="group mb-14 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-normal text-gray-900 leading-tight tracking-tight">
          My Work
        </h1>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          The most important roles, projects, and ideas that I put my time into.
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl shrink-0 border-t border-gray-100" />

      <div className="min-h-0 flex-1 overflow-y-auto pb-16 scrollbar-hide">
        <div className="mx-auto w-full max-w-3xl space-y-7">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6">
              <div className="w-36 shrink-0 text-right text-sm tabular-nums text-gray-500 leading-relaxed pt-0.5">
                {item.date}
              </div>
              <div className="flex-1 min-w-0">
                <WorkEntry item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
