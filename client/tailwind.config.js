/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'base': {
          light: '#ebdfd7',
          DEFAULT: '#ebdfd7',
          dark: '#4b4b4b',
        },
        'base-lt': {
          light: '#f2eae5',
          DEFAULT: '#f2eae5',
          dark: '#333'
        },
      },
      gridTemplateColumns: {
        'sidebar': "260px auto", //for sidebar layout
        "sidebar-collapsed": "64px auto", //for collapsed sidebar layout
      },
      keyframes: {
        'rotate360': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },

  plugins: [],
}

