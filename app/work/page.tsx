import { getAllWorkItems } from '@/data/work-items';
import { Timeline } from '@/components/work/Timeline';
import { PageShell } from '@/components/ui/PageShell';

export default function WorkPage() {
  return (
    <PageShell
      title="The Timeline"
      scene="timeline"
      subtitle="The most important roles, projects, and ideas that I put my time into."
    >
      <div className="max-w-page">
        <Timeline items={getAllWorkItems()} />
      </div>
    </PageShell>
  );
}
