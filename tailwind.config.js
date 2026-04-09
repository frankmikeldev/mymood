/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main:           '#F5F0E8',
        card:           '#EDE8DF',
        badge:          '#E6E0D5',
        forest:         '#1C3A2E',
        'forest-light': '#24503E',
        cta:            '#E8521A',
        'cta-hover':    '#D4480F',
        header:         '#1a1a1a',
        body:           '#222222',
        muted:          '#6b7280',
        border:         '#D8D1C4',
        'border-dark':  '#2A4A3A',
      },

      boxShadow: {
        warm: '0 4px 24px rgba(0, 0, 0, 0.08)',
        cta:  '0 4px 20px rgba(232, 82, 26, 0.35)',
        card: '0 2px 16px rgba(0, 0, 0, 0.06)',
      },

      borderRadius: {
        xl:   '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      backdropBlur: {
        sm: '6px',
        md: '12px',
      },

      fontFamily: {
        sans:    ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        body: ['17px', { lineHeight: '1.65' }],
      },

      fontWeight: {
        nav:      '500',
        btn:      '700',
        headline: '800',
      },
    },
  },
  plugins: [],
};