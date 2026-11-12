import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackLink({ href = '/', label = 'Home' }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group back-link"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
