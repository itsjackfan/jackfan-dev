import Link from 'next/link';
import { SmartLink } from '@/components/ui/SmartLink';
import { Github, Linkedin, Mail } from 'lucide-react';
import { AsciiSky } from '@/components/background/AsciiSky';

export default function Home() {
  const tableOfContents = [
    { number: '01', title: 'The Timeline', subtitle: 'The most important roles, projects, and ideas that I put my time into.', href: '/work' },
    { number: '02', title: 'The Main Planter', subtitle: 'A microcosm of some of my thoughts; expect both technical and life-related content, as well as different lengths of content. The tags are the ground truth (hopefully).', href: '/blog' },
    { number: '03', title: 'The Birds-Eye View', subtitle: 'Quite literally, I think in graphs...a visualisation of my internal notes and thoughts. Updated roughly every week.', href: '/graph' },
    // { number: '04', title: 'The Reading List', subtitle: 'Work and life reads — papers, books, and long-form, with read / in progress / to read.', href: '/reading' },
  ];

  return (
    <div className="relative flex min-h-screen flex-col px-6 sm:px-8 lg:px-12">
      <AsciiSky scene="home" />
      
      {/* Hero Section - Vertically Centered */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Left Side - Name + Table of Contents */}
            <div className="flex-1">
              <h1 className="text-display mb-12">
                Jack Fan
              </h1>

              <nav>
                <ul className="space-y-6">
                  {tableOfContents.map((item) => (
                    <li key={item.number}>
                      <Link
                        href={item.href}
                        className="group grid grid-cols-[2rem_1fr] items-center gap-x-2 text-ink-body transition-colors hover:text-ink"
                      >
                        <span className="tabular-nums text-ink-muted">
                          {item.number}
                        </span>
                        <span>{item.title}</span>
                        {item.subtitle && (
                          <>
                            <span />
                            <span className="mt-0.5 text-sm text-ink-muted">
                              {item.subtitle}
                            </span>
                          </>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Vertical Divider */}
            <div className="relative flex items-center justify-center self-stretch py-8">
              <div className="divider-v" />
            </div>

            {/* Right Side - Placeholder Text */}
            <div className="flex-1">
              <div className="space-y-6 text-lg leading-relaxed text-ink-body">
                <p className="italic">
                  Life is a collection of <SmartLink href="/blog/critical-paths">infinite gamescapes</SmartLink>, or a countably infinite set of infinite games and an uncountably infinite set of parrots. 
                </p>
                <p>
                  If you have reading recs or have strong opinions about continual learning, mimetic desire, or vulnerability and give vs. take in relationships, please feel free to reach out: <br /> <SmartLink href="mailto:jack.fan.dev@gmail.com">jack [dot] fan [dot] dev [at] gmail [dot] com</SmartLink>.
                </p>
                <p className="text-sm italic text-ink-muted">
                  P.S. If you notice or get the easter egg on this website, email me immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links - Bottom Centered */}
      <div className="relative z-10 flex flex-col items-center gap-4 pb-8 sm:pb-12 lg:pb-16">
        {/* Resume Button - Liquid Glassmorphic */}
        <a
          href="/JF_resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="glass-button"
        >
          <span className="relative z-10 text-sm font-medium text-ink">
            Resume
          </span>
          {/* Liquid shimmer effect */}
          <div className="glass-shimmer" />
        </a>

        {/* Social Icons */}
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/itsjackfan"
            target="_blank"
            rel="noreferrer"
            className="icon-link"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/in/jack-fan-dev"
            target="_blank"
            rel="noreferrer"
            className="icon-link"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:jack.fan.dev@gmail.com"
            className="icon-link"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
