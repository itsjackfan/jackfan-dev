import type { Config } from 'tailwindcss';

// Colors live in app/globals.css as CSS variables (space-separated RGB); this maps them to utilities.
const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: rgb('ink'), body: rgb('ink-body'), muted: rgb('ink-muted'), faint: rgb('ink-faint') },
        surface: { DEFAULT: rgb('surface'), raised: rgb('surface-raised'), high: rgb('surface-high') },
        line: rgb('line'),
        accent: { DEFAULT: rgb('accent'), strong: rgb('accent-strong') },
      },
      maxWidth: {
        page: '48rem',
        prose: '42rem',
        wide: '72rem',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
};
export default config;
