import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        outside: {
          // Dynamic CSS Variable Tokens with Sun-Bleached Gallery Fallbacks
          canvas: 'var(--bg-canvas, #F7F5F0)',
          surface: 'var(--bg-surface, #EDEAE2)',
          elevated: 'var(--bg-elevated, #FCFBF8)',
          border: 'var(--border-hairline, #DCD7CC)',
          ink: 'var(--ink-primary, #111110)',
          inkSecondary: 'var(--ink-secondary, #52504B)',
          accent: 'var(--accent-primary, #B82328)',
          accentSecondary: 'var(--accent-secondary, #3F4E44)',

          // Compatibility Aliases
          bg: 'var(--bg-canvas, #F7F5F0)',
          card: 'var(--bg-elevated, #FCFBF8)',
          cardSubtle: 'var(--bg-surface, #EDEAE2)',
          text: 'var(--ink-primary, #111110)',
          muted: 'var(--ink-secondary, #52504B)',
          crimson: 'var(--accent-primary, #B82328)',
          crimsonHover: 'var(--accent-primary, #B82328)',
          moss: 'var(--accent-secondary, #3F4E44)',
          chalk: 'var(--bg-elevated, #FCFBF8)',
        },
      },
      borderRadius: {
        dynamic: 'var(--border-radius, 0px)',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Syne',
          'Clash Display',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        editorial: '0 1px 3px 0 rgba(17, 17, 16, 0.04), 0 1px 2px -1px rgba(17, 17, 16, 0.04)',
        gallery: '0 8px 30px -4px rgba(82, 80, 75, 0.08)',
      },
      letterSpacing: {
        tighter: '-0.03em',
        editorial: '0.25em',
      },
      keyframes: {
        'curtain-reveal': {
          '0%': { clipPath: 'inset(100% 0 0 0)', opacity: '0' },
          '100%': { clipPath: 'inset(0 0 0 0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'curtain-reveal': 'curtain-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'marquee': 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
