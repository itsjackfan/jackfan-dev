'use client';

import Image from 'next/image';

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  imageSrc?: string;
  imageAlt?: string;
};

type Collaborator = {
  name: string;
  affiliation: string;
  role: string;
};

const TEAM: TeamMember[] = [
  {
    name: 'Jack Fan',
    role: 'Founder · Continual Learning and Compositional Systems',
    bio: "Harvard CS '28 & ThirdLayer; prev @ Series. Exploring compositional ideas for agent/model augmentation to improve continual learning and agentic performance.",
    imageSrc: '/Jack%20Profile%202.png',
    imageAlt: 'Portrait of Jack Fan',
  },
];

const COLLABORATORS: Collaborator[] = [
  {
    name: 'Visiting engineers',
    affiliation: 'Independent & partner labs',
    role: 'Short, question-driven sprints',
  },
  {
    name: 'Reviewers',
    affiliation: 'Research & industry',
    role: 'Feedback on artifacts and evaluation',
  },
  {
    name: 'Infra partners',
    affiliation: 'Cloud & tooling',
    role: 'Compute, observability, and deployment',
  },
];

const BACKERS = ['Independent capital', 'Angels', 'Partner orgs'];

const PROCESS_STEPS = [
  {
    title: 'Start from a frontier question',
    body: 'Turn a vague hunch into a concrete, falsifiable question.',
  },
  {
    title: 'Build a thin prototype',
    body: 'Ship the smallest artifact that can expose real failure modes.',
  },
  {
    title: 'Instrument and stress-test',
    body: 'Wire up measurement and push the system until it breaks.',
  },
  {
    title: 'Publish a useful trace',
    body: 'Leave behind tools, notes, or maps that others can reuse.',
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-bg text-text">
      <div className="relative mx-auto max-w-[var(--container)] px-4 pb-20 pt-28 sm:pb-28 sm:pt-32">
        {/* ABOUT VIEWPORT */}
        <section className="mb-10 sm:mb-12">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-brand-md backdrop-blur-glass">
            <div className="grid gap-8 p-8 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:p-10 lg:p-12">
              <div className="space-y-5 sm:space-y-6">
                <p className="text-[0.8rem] uppercase tracking-[0.36em] text-text/50">
                  About
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl lg:text-[2.7rem] lg:leading-tight">
                  Building tooling for self-directed research.
                </h1>
                <p className="text-sm leading-relaxed text-text/70 sm:text-base">
                  Autodidact Labs is a small lab for building agents,
                  instruments, and maps that help models push on their own
                  frontiers. The emphasis is on tight loops between ideas,
                  prototypes, and real-world feedback instead of large,
                  slow-moving programs.
                </p>
                <p className="text-sm leading-relaxed text-text/60 sm:text-base">
                  This viewport sketches who is behind the lab, how
                  collaborations tend to work, and the kinds of projects that
                  show up here.
                </p>
              </div>

              <div className="flex flex-col justify-between gap-6 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.4),transparent_55%),radial-gradient(circle_at_bottom,_rgba(37,99,235,0.45),transparent_60%)] p-6">
                <div className="space-y-3">
                  <p className="text-[0.8rem] uppercase tracking-[0.32em] text-text/60">
                    Orientation
                  </p>
                  <p className="text-sm leading-relaxed text-text">
                    Small, sharp, and experimental. Prefer instruments over
                    grand narratives; prefer public traces over hidden work.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-text/80">
                  <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1">
                    Continual learning
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1">
                    Agent tooling
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1">
                    Evaluation &amp; maps
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR TEAM HEADER */}
        <section className="mb-4 flex items-center justify-center text-center sm:mb-6">
          <h2 className="font-sans text-[3.5rem] font-semibold tracking-tight text-text sm:text-[4rem] lg:text-[4.5rem]">
            Our Team
          </h2>
        </section>

        {/* TEAM VIEWPORT */}
        <section className="mb-10 sm:mb-14">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-brand-md backdrop-blur-glass">
            <div className="px-6 pb-7 pt-6 sm:px-10 sm:pb-8 sm:pt-7">
              <div className="space-y-6">
                {/* Team grid */}
                <div className="flex justify-center">
                  <div
                    className={`grid w-full gap-5 ${
                      TEAM.length === 1
                        ? 'max-w-md place-items-center'
                        : 'max-w-3xl sm:grid-cols-2'
                    }`}
                  >
                    {TEAM.map((member) => (
                      <article
                        key={member.name}
                        className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 px-5 py-6 text-left shadow-brand-md"
                      >
                        <div className="mb-4 flex items-start gap-4 sm:gap-5">
                          {member.imageSrc && (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface sm:h-20 sm:w-20">
                              <Image
                                src={member.imageSrc}
                                alt={member.imageAlt ?? member.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                                priority
                              />
                            </div>
                          )}
                          <div className="min-w-0 space-y-1.5">
                            <h3 className="text-base font-semibold leading-tight text-text sm:text-lg">
                              {member.name}
                            </h3>
                            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-text/60 sm:text-xs">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-text/75 sm:text-[0.95rem]">
                          {member.bio}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Collaborators ticker */}
                <div className="mt-4">
                  <div className="mb-2 text-[0.65rem] uppercase tracking-[0.3em] text-text/50">
                    Collaborators
                  </div>
                  <div className="ticker rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-brand-md">
                    <div className="ticker-track">
                      {[...COLLABORATORS, ...COLLABORATORS].map(
                        (collab, index) => (
                          <div
                            key={`${collab.name}-${index}`}
                            className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs text-text/80 shadow-[0_4px_18px_rgba(15,23,42,0.4)]"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo to-blue text-[0.8rem] font-medium text-white">
                              {collab.name.charAt(0)}
                            </div>
                            <div className="flex flex-col gap-0.5 text-left">
                              <span className="font-medium">
                                {collab.name}
                              </span>
                              <span className="text-[0.8rem] text-text/60">
                                {collab.affiliation} · {collab.role}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BACKED BY (NO VIEWPORT) */}
        <section className="mb-6 sm:mb-8">
          <div className="mb-4 text-center text-[0.8rem] uppercase tracking-[0.3em] text-text/55">
            Backed by
          </div>
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 sm:gap-6">
            {BACKERS.map((label) => (
              <div
                key={label}
                className="flex h-12 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_32px_rgba(15,23,42,0.5)]"
                aria-label={label}
              >
                <div className="flex h-6 w-20 items-center justify-center rounded-xl bg-white/40">
                  <span className="sr-only">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW THE LAB WORKS – TEXT LEFT, DIAGRAM RIGHT */}
        {/* <section>
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-start lg:gap-2">

            <div className="space-y-4 lg:pt-4">
              <p className="text-[0.8rem] uppercase tracking-[0.36em] text-slate-500">
                How the lab works
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                A simple loop, repeated often.
              </h2>
              <p className="max-w-sm text-sm text-slate-700 sm:text-base">
                Most threads run as focused sprints: tighten the question, build
                a thin slice of tooling, push it hard, then keep the maps and
                utilities that fall out.
              </p>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)]">
              <div className="px-6 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-7">
                <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-between">
                  {PROCESS_STEPS.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex items-center gap-4 md:gap-5"
                    >
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:px-5 sm:py-5">
                        <div className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                          Step {index + 1}
                        </div>
                        <p className="mb-2 text-sm font-semibold text-slate-900 sm:text-base">
                          {step.title}
                        </p>
                        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                          {step.body}
                        </p>
                      </div>

                      {index < PROCESS_STEPS.length - 1 && (
                        <div className="hidden shrink-0 items-center justify-center md:flex">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
                            →
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}

