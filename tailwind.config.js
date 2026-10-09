/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Auros Abyssal Theme Palette
        abyss: '#012624',        // Primary canvas: page background
        deep: '#011d1c',         // Recessed surface: wells, deep panels
        kelp: '#003734',         // Raised surface: cards, content panels
        mist: '#edfffe',         // Emphasized text, labels
        platinum: '#ffffff',     // Headings, active items, high contrast
        silver: '#bbc7c6',       // Secondary body text, descriptions
        ash: '#f2f2f2',          // Tertiary text
        'slate-deep': '#707777', // Subtle borders
        phosphor: '#fde9ff',     // Lavender highlight for numbers & stats
        bioluminescent: '#00827c',
        aurora: '#cbfffc',

        // Semantic alerts
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',

        primary: {
          DEFAULT: '#003734',
          50: '#edfffe',
          100: '#cbfffc',
          200: '#8df6f0',
          300: '#3ee0d6',
          400: '#14b8a6',
          500: '#00827c',
          600: '#005f5a',
          700: '#003734',
          800: '#012624',
          900: '#011d1c',
        },
      },
      borderRadius: {
        'cards': '16px',
        'buttons': '6px',
        'sm-elem': '6px',
      },
      backgroundImage: {
        'bioluminescent': 'linear-gradient(90deg, rgb(0, 130, 124) 0%, rgb(203, 255, 252) 100%)',
        'aurora': 'linear-gradient(90deg, rgb(203, 255, 252) 0%, rgb(237, 255, 254) 26.25%, rgb(255, 253, 250) 47.57%, rgb(250, 209, 255) 88.96%)',
      },
      fontFamily: {
        sans: ['Matter', 'Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
