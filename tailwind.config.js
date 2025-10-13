/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        night:      "#0d0b14",
        royal:      "#1b1330",
        iris:       "#2b1d4a",
        orchid:     "#3c2764",
        gold:       "#f1d08a",
        "gold-200": "#f6e5b9",
        "gold-300": "#ffecb3",
        "gold-400": "#ffd98c",
        "rose-gold":"#f3d3be",
        mist:       "#9da4c2",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(241,208,138,.35), 0 8px 40px rgba(111,66,193,.35)",
        "inner-card": "inset 0 1px 0 rgba(255,255,255,.05), 0 0 0 1px rgba(255,255,255,.06)",
      },
      backgroundImage: {
        "radial-iris":
          "radial-gradient(1200px 600px at 10% -10%, rgba(113,66,193,.25), transparent), radial-gradient(900px 500px at 100% 0%, rgba(43,29,74,.6), transparent)",
        "gold-grad":
          "linear-gradient(170deg, #fff4cc 0%, #f1d08a 30%, #caa55f 70%, #f6e5b9 100%)"
      },
      borderRadius: {
        pill: "999px",
      }
    },
  },
  plugins: [],
}
