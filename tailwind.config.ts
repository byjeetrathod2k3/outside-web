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
          bg: '#FAF9F6', // Luxury Ivory / Alabaster
          surface: '#FFFFFF', // Pure Crisp White
          card: '#FFFFFF',
          cardSubtle: '#F5F3EF',
          border: '#E7E2DA',
          borderLight: '#F0ECE4',
          text: '#111111', // Deep Luxury Ink
          textSecondary: '#44403C',
          muted: '#78716C',
          mutedLight: '#A8A29E',
          crimson: '#D91E2A', // Signature Brand Red
          crimsonHover: '#B7121D',
          crimsonSoft: '#FDF2F2',
          black: '#121212',
          charcoal: '#1C1917',
          chalk: '#FAF9F6',
          chalkDim: '#E7E5E4',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['var(--font-clash)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'luxury-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
