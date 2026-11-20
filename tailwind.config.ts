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
          // Mandatory Sun-Bleached Gallery Tokens
          canvas: '#F7F5F0',       // Warm Alabaster (Primary Canvas)
          surface: '#EDEAE2',      // Raw Limestone (Secondary Cards, Frames, Sidebar)
          elevated: '#FCFBF8',     // Pure Chalk (Sticky Headers, Drawers, Inputs)
          border: '#DCD7CC',       // Sandstone Hairline (1px structural grid)
          ink: '#111110',          // Obsidian Carbon (Headings, Primary Buttons)
          inkSecondary: '#52504B', // Warm Graphite (Body text, garment specs)
          accent: '#B82328',       // Serpent Oxide (Live drop dot, low-stock warning)
          accentSecondary: '#3F4E44', // Oxidized Moss (In-stock badge, Women-first indicator)

          // Aliases for compatibility
          bg: '#F7F5F0',
          card: '#FCFBF8',
          cardSubtle: '#EDEAE2',
          text: '#111110',
          muted: '#52504B',
          crimson: '#B82328',
          crimsonHover: '#96191E',
          moss: '#3F4E44',
          chalk: '#FCFBF8',
        },
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
      },
      animation: {
        'curtain-reveal': 'curtain-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
