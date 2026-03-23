import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllTimelineEntries } from '@/data/timeline-items';
import { TimelineView } from '@/components/work/TimelineView';

export default function WorkPage() {
  const entries = getAllTimelineEntries();

  return (
    <div className="min-h-screen bg-white px-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl py-24">
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to home</span>
        </Link>

        <div className="mb-16">
          <h1 className="text-3xl font-normal text-gray-900 tracking-tighter sm:text-4xl lg:text-5xl">
            My Work
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Roles, projects, papers, workshops, and things I&apos;ve read — everything I put time into.
          </p>
        </div>

        <TimelineView entries={entries} />
      </div>
    </div>
  );
}
