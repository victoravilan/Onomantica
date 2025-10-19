/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        'background-purple': '#1c122c',
        'brand-gold': '#d4af37',
        'card-purple': '#2b1e3f',
        'button-purple': '#4a2c70',
        'border-purple': '#4a3b5e',
      },
    },
  },
  plugins: [],
}