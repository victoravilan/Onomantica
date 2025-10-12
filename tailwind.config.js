/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['ui-sans-serif','system-ui','-apple-system','Segoe UI','Inter','Roboto','sans-serif'] }
    }
  },
  plugins: []
}
