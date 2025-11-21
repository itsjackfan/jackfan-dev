'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  /** Milliseconds per character */
  speedMsPerChar?: number;
  /** Optional delay before typing starts (ms) */
  startDelayMs?: number;
  className?: string;
}

export function TypewriterText({
  text,
  speedMsPerChar = 80,
  startDelayMs = 0,
  className,
}: TypewriterTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let active = true;
    let timeoutId: NodeJS.Timeout | undefined;
    let intervalId: NodeJS.Timeout | undefined;

    const startTyping = () => {
      intervalId = setInterval(() => {
        if (!active) return;
        setVisibleCount((current) => {
          if (current >= text.length) {
            if (intervalId) clearInterval(intervalId);
            return current;
          }
          return current + 1;
        });
      }, speedMsPerChar);
    };

    if (startDelayMs > 0) {
      timeoutId = setTimeout(startTyping, startDelayMs);
    } else {
      startTyping();
    }

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [speedMsPerChar, startDelayMs, text]);

  const content = text.slice(0, visibleCount);

  return <span className={className}>{content}</span>;
}


