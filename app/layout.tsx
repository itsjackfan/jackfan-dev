import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Autodidact Research',
  description: 'Advancing AI research through innovative approaches',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 bg-black/40 px-4 py-10 text-sm text-text/60 backdrop-blur-glass">
            <div className="mx-auto flex max-w-[var(--container)] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-text/40">
                  Autodidact Labs
                </div>
                <p className="max-w-md text-text/60">
                  Teaching models to push their own frontiers.
                </p>
                <p className="text-xs text-text/40">
                  © {new Date().getFullYear()} Autodidact Labs. All rights
                  reserved.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <div className="font-medium text-text/80">Lab</div>
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/projects"
                      className="transition hover:text-teal"
                    >
                      Projects
                    </Link>
                    <Link href="/blog" className="transition hover:text-teal">
                      Blog
                    </Link>
                    <Link href="/contact" className="transition hover:text-teal">
                      Contact
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium text-text/80">Institute</div>
                  <div className="flex flex-col gap-1">
                    <Link href="#" className="transition hover:text-teal">
                      Mission &amp; Values
                    </Link>
                    <Link href="#" className="transition hover:text-teal">
                      The Team
                    </Link>
                    <Link href="#" className="transition hover:text-teal">
                      Open Problems
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium text-text/80">Legal</div>
                  <div className="flex flex-col gap-1">
                    <Link href="#" className="transition hover:text-teal">
                      Privacy Policy
                    </Link>
                    <Link href="#" className="transition hover:text-teal">
                      Terms of Use
                    </Link>
                    <Link href="#" className="transition hover:text-teal">
                      Copyright
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
