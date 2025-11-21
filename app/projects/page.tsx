'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  x: number; // 0–100
  y: number; // 0–100
  label?: string;
  type: 'root' | 'project' | 'placeholder';
  tooltip: string;
  revealAt: number; // 0–1 scroll progress
}

interface Edge {
  from: string;
  to: string;
  revealAt: number; // 0–1 scroll progress
}

const NODES: Node[] = [
  {
    id: 'root',
    x: 50,
    y: 30,
    type: 'root',
    tooltip: 'Origin of the lab — a single question about autonomous research.',
    revealAt: 0,
  },
  {
    id: 'space-mapper',
    x: 25,
    y: 55,
    type: 'project',
    label: 'Space Mapper',
    tooltip: 'Map capability regimes and research spaces.',
    revealAt: 0.15,
  },
  {
    id: 'crypto-contextualizer',
    x: 75,
    y: 55,
    type: 'project',
    label: 'Crypto Contextualizer',
    tooltip: 'Contextualize crypto artifacts and ecosystems.',
    revealAt: 0.15,
  },
  {
    id: 'future-1',
    x: 15,
    y: 78,
    type: 'placeholder',
    label: '?',
    tooltip: 'New mode — coming soon.',
    revealAt: 0.35,
  },
  {
    id: 'future-2',
    x: 35,
    y: 82,
    type: 'placeholder',
    label: '?',
    tooltip: 'New mode — coming soon.',
    revealAt: 0.4,
  },
  {
    id: 'future-3',
    x: 65,
    y: 80,
    type: 'placeholder',
    label: '?',
    tooltip: 'New mode — coming soon.',
    revealAt: 0.45,
  },
  {
    id: 'future-4',
    x: 85,
    y: 76,
    type: 'placeholder',
    label: '?',
    tooltip: 'New mode — coming soon.',
    revealAt: 0.5,
  },
];

const EDGES: Edge[] = [
  { from: 'root', to: 'space-mapper', revealAt: 0.15 },
  { from: 'root', to: 'crypto-contextualizer', revealAt: 0.15 },
  { from: 'space-mapper', to: 'future-1', revealAt: 0.35 },
  { from: 'space-mapper', to: 'future-2', revealAt: 0.4 },
  { from: 'crypto-contextualizer', to: 'future-3', revealAt: 0.45 },
  { from: 'crypto-contextualizer', to: 'future-4', revealAt: 0.5 },
];

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const maxScrollable = scrollHeight - clientHeight;
      if (maxScrollable <= 0) {
        setProgress(0);
        return;
      }
      const raw = scrollTop / maxScrollable;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

function getRevealProgress(
  globalProgress: number,
  revealAt: number,
  window: number
) {
  const t = (globalProgress - revealAt) / window;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t;
}

function ProjectsCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress();

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-bg via-[#12052b] to-bg"
    >
      {/* Subtle neural wash echoing the global background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(94,92,255,0.26),_transparent_55%)]" />

      {/* Edges as SVG lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="project-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0" />
            <stop offset="30%" stopColor="#c7d2fe" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ddd6fe" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#c7d2fe" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
          </linearGradient>
        </defs>
        {EDGES.map((edge) => {
          const from = NODES.find((n) => n.id === edge.from);
          const to = NODES.find((n) => n.id === edge.to);
          if (!from || !to) return null;

          const edgeProgress = getRevealProgress(progress, edge.revealAt, 0.22);
          if (edgeProgress <= 0) return null;

          const dx = to.x - from.x;
          const dy = to.y - from.y;

          // Organic, slightly asymmetric curvature based on relative positions
          const curvatureBase = Math.min(18, Math.max(8, Math.abs(dx) * 0.35));
          const verticalBias = dy >= 0 ? 0.6 : 1.1;

          const c1x = from.x + dx * 0.28;
          const c2x = from.x + dx * 0.7;
          const c1y = from.y - curvatureBase;
          const c2y = to.y + curvatureBase * verticalBias;

          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`}
              stroke="url(#project-edge)"
              className="transition-all duration-500"
              strokeWidth={0.34}
              fill="none"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - edgeProgress}
              style={{
                opacity: 0.15 + edgeProgress * 0.85,
                filter:
                  'drop-shadow(0 0 6px rgba(167,139,250,0.65)) drop-shadow(0 0 14px rgba(129,140,248,0.45))',
              }}
            />
          );
        })}
      </svg>

      {/* Nodes as small hoverable dots */}
      {NODES.map((node) => {
        const nodeProgress = getRevealProgress(progress, node.revealAt, 0.18);

        const baseOpacity = 0.12 + nodeProgress * 0.88;
        const isInteractive = nodeProgress > 0.1;

        const nodeTone =
          node.type === 'root'
            ? 'bg-teal'
            : node.type === 'project'
              ? 'bg-primary'
              : 'bg-text/40';

        const nodeShadow =
          node.type === 'root'
            ? 'shadow-[0_0_12px_4px_rgba(45,212,191,0.85),0_0_28px_10px_rgba(34,211,238,0.55)]'
            : node.type === 'project'
              ? 'shadow-[0_0_10px_3px_rgba(167,139,250,0.8),0_0_22px_10px_rgba(129,140,248,0.6)]'
              : 'shadow-[0_0_9px_2px_rgba(248,250,252,0.65),0_0_16px_6px_rgba(148,163,184,0.45)]';

        return (
          <div
            key={node.id}
            className={`group absolute -translate-x-1/2 -translate-y-1/2 transform flex items-center justify-center transition-opacity duration-300 ${
              isInteractive ? '' : 'pointer-events-none'
            }`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: '3rem',
              height: '3rem',
              opacity: baseOpacity,
            }}
          >
            <div
              className={`relative flex h-5 w-5 items-center justify-center rounded-full ${nodeTone} ${nodeShadow} transition-transform duration-300 group-hover:scale-125`}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-white/80 shadow-[0_0_8px_2px_rgba(248,250,252,0.95)]" />
            </div>
            {/* Tooltip */}
            <div className="pointer-events-none absolute left-1/2 top-7 z-10 w-max -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="rounded-2xl border border-white/12 bg-black/75 px-3 py-2 text-xs text-text/85 shadow-brand-md backdrop-blur-frost">
                {node.label ? (
                  <div className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-text/60">
                    {node.label}
                  </div>
                ) : (
                  <div className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-text/60">
                    Origin
                  </div>
                )}
                <div className="max-w-xs text-[0.7rem] text-text/80">
                  {node.type === 'placeholder' ? 'Coming soon.' : node.tooltip}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Intro copy at the top-left, sitting just below the navbar */}
      <div className="pointer-events-none absolute left-6 top-24 max-w-xs text-xs text-text/70 sm:left-12 sm:top-28 sm:max-w-sm sm:text-sm">
        <div className="mb-2 text-[0.65rem] uppercase tracking-[0.25em] text-text/45">
          Project graph
        </div>
        <p>
          Start with a single point. As you scroll, the tree of current modes
          and speculative branches fades into view.
        </p>
      </div>

      {/* Foggy, unknown bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#160833]/80 to-[#050111] blur-3xl" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[0.7rem] uppercase tracking-[0.25em] text-text/40">
        Beyond this point is mist — we&apos;re still figuring it out.
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-[220vh] bg-bg">
      <div className="sticky top-0 h-screen">
        <ProjectsCanvas />
      </div>
    </div>
  );
}
