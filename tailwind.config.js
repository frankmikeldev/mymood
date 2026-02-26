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
        // 🌑 Backgrounds
        main: '#0b0d12', // deep background
        card: '#141720', // section/card
        badge: '#1a1f2a', // badges, pills

        // ✨ Text
        header: '#ffffff', // white headings
        body: '#9ca3af', // soft gray text
        muted: '#6b7280', // dimmed text

        // 💜 Accent (for icons)
        accent: {
          purple: '#7c3aed',
          dark: '#6d28d9',
        },

        // 🧱 Border
        border: '#1f2735',
      },

      // 🌟 Shadows
      boxShadow: {
        glow: '0 0 20px rgba(124, 58, 237, 0.4)',
        card: '0 4px 25px rgba(0, 0, 0, 0.3)',
      },

      // 🧩 Radius & Blur
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },

      backdropBlur: {
        sm: '6px',
        md: '12px',
      },

      // 🖋 Fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
