import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper / cutting-table palette
        paper: {
          DEFAULT: '#f7f2e9',
          deep: '#efe6d5',
          card: '#fffdf8',
        },
        ink: {
          DEFAULT: '#22201c',
          soft: '#4a463f',
          faint: '#7c7568',
        },
        terracotta: {
          DEFAULT: '#c4593a',
          deep: '#a3452b',
          soft: '#e8ad99',
        },
        teal: {
          DEFAULT: '#1f5a52',
          deep: '#153f39',
          soft: '#9cc0b9',
        },
        line: '#ddd0ba',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(34,32,28,0.04), 0 8px 24px -12px rgba(34,32,28,0.18)',
        lift: '0 2px 4px rgba(34,32,28,0.06), 0 18px 40px -18px rgba(34,32,28,0.28)',
      },
      backgroundImage: {
        'ruler-grid':
          'linear-gradient(to right, rgba(196,89,58,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(196,89,58,0.05) 1px, transparent 1px)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
