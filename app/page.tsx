'use client';

import { useHasScrolled } from '@/components/hooks/useHasScrolled';
import { TypewriterText } from '@/components/TypewriterText';
import { Github, Linkedin, Mail } from 'lucide-react';
import { NeuralBackground } from '@/components/background/NeuralBackground';

export default function Home() {
  const hasScrolled = useHasScrolled(10);

  return (
    <div className="min-h-screen">
      {/* Hero: just the name, inviting scroll */}
      <section className="relative isolate h-screen overflow-hidden">
        <NeuralBackground />

        <div className="relative mx-auto flex h-full max-w-[var(--container)] flex-col px-4 pb-16 pt-12 sm:pb-20 sm:pt-12">
          <div className="mt-auto mb-auto text-center">
            <h1 className="font-mono text-[8rem] font-semibold tracking-tighter sm:text-[8rem] lg:text-[8.5rem]">
              <TypewriterText
                text="Autodidact Labs"
                speedMsPerChar={130}
                className="bg-text/50 bg-clip-text text-transparent"
              />
            </h1>
            <div className="text-[1.5rem] font-mono uppercase tracking-[0.3em] text-text/50">
              Teaching models to push their own frontiers
            </div>
          </div>
        </div>

        {/* Subtle primary links, bottom-right */}
        <div className="pointer-events-auto absolute bottom-6 right-6 flex items-center gap-3 text-text/50 sm:bottom-8 sm:right-8">
          <a
            href="https://github.com/The-Autodidact-Lab"
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-2 text-text/50 transition hover:text-text/90"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/in/jack-fan-dev"
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-2 text-text/50 transition hover:text-text/90"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:jack.fan.dev@gmail.com"
            className="rounded-full p-2 text-text/50 transition hover:text-text/90"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Lab overview */}
      <section className="relative border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-[var(--container)] flex-col gap-16 px-4 py-24 sm:py-32">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-text/50">
              About the lab
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              A small lab exploring large, open-ended research directions.
            </h2>
            <p className="text-base text-text/70 sm:text-lg">
              Autodidact Labs is an experiment in building tools, agents, and
              methodologies that can push on frontier questions without a large
              institution behind them. The emphasis is on carefully scoped
              systems that compound over time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {/* Team placeholder glass tab */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-glass backdrop-blur-glass shadow-brand-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent" />
              <div className="relative p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-text/50">
                    Lab Team
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-text/60">
                    Placeholder
                  </span>
                </div>
                <p className="text-sm text-text/70 sm:text-base">
                  This tab will eventually list core contributors, visiting
                  collaborators, and the &quot;unofficial&quot; extended
                  network that shapes the lab&apos;s work.
                </p>
                <div className="mt-6 grid gap-3 text-xs text-text/50 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-black/30 px-4 py-3">
                    <div className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-text/40">
                      Shape
                    </div>
                    <div>Small, sharp, highly technical.</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/30 px-4 py-3">
                    <div className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-text/40">
                      Focus
                    </div>
                    <div>Autonomous systems, interpretability, tooling.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick metadata */}
            <div className="space-y-4 text-sm text-text/70">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <div className="mb-2 text-xs uppercase tracking-[0.25em] text-text/50">
                  Orientation
                </div>
                <p>
                  Lean toward building things that clarify questions:
                  prototypes, evaluation harnesses, mapping tools, and public
                  writeups.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <div className="mb-2 text-xs uppercase tracking-[0.25em] text-text/50">
                  Process
                </div>
                <p>
                  Short feedback cycles, heavy instrumentation, and a bias
                  toward publishing intermediate artifacts instead of waiting
                  for a &quot;perfect&quot; paper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent posts & publications (placeholder) */}
      <section className="relative border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-[var(--container)] px-4 py-24 sm:py-32">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-text/50">
                Recent posts &amp; publications
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                A stream of experiments, notes, and maps.
              </h2>
            </div>
            <p className="max-w-md text-sm text-text/65">
              This section will eventually collect technical reports,
              long-form essays, and public notebooks. For now, it sketches the
              kinds of artifacts the lab expects to produce.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-glass">
              <div className="mb-2 text-xs uppercase tracking-[0.25em] text-text/50">
                Placeholder
              </div>
              <h3 className="mb-3 text-lg font-semibold text-text">
                Mapping capability frontiers
              </h3>
              <p className="text-sm text-text/70">
                A running notebook on how we benchmark new model behaviors in
                unfamiliar domains.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-glass">
              <div className="mb-2 text-xs uppercase tracking-[0.25em] text-text/50">
                Placeholder
              </div>
              <h3 className="mb-3 text-lg font-semibold text-text">
                Architectures for self-directed agents
              </h3>
              <p className="text-sm text-text/70">
                Design sketches for agents that can autonomously explore
                research spaces while remaining steerable.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-glass">
              <div className="mb-2 text-xs uppercase tracking-[0.25em] text-text/50">
                Placeholder
              </div>
              <h3 className="mb-3 text-lg font-semibold text-text">
                Failure modes &amp; safety stories
              </h3>
              <p className="text-sm text-text/70">
                Case studies on when autonomous tooling goes wrong and what
                guardrails actually helped in practice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
