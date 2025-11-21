'use client';

import { useEffect, useState } from 'react';

export function useHasScrolled(threshold = 1) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setHasScrolled(window.scrollY > threshold);
    };

    // Run once on mount in case the user has already scrolled
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return hasScrolled;
}


