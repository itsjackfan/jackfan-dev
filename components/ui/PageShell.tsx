import { BackLink } from './BackLink';
import { AsciiSky } from '@/components/background/AsciiSky';
import type { Scene } from '@/components/background/scene';

type Props = {
  title: string;
  scene: Scene;
  subtitle?: React.ReactNode;
  back?: { href: string; label: string };
  animate?: boolean;
  children: React.ReactNode;
};

// Every page: fixed back link, title block, rule, scrolling content region. Pages only differ inside children.
export function PageShell({ title, scene, subtitle, back, animate = false, children }: Props) {
  return (
    <div className="flex h-screen flex-col px-6 sm:px-8 lg:px-12">
      <AsciiSky scene={scene} />
      <BackLink {...back} />
      <div className="page-column shrink-0 pb-6 pt-32">
        <header className={animate ? 'rise' : ''}>
          <h1 className="text-title">{title}</h1>
          {subtitle && <div className="mt-3 text-sm text-ink-muted">{subtitle}</div>}
        </header>
      </div>
      <div className="page-column shrink-0 border-t border-line" />
      <div data-scroll className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <div className="page-column pb-16 pt-6">{children}</div>
      </div>
    </div>
  );
}
