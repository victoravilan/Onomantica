/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0214",
          soft: "#120a22",
        },
        gold: {
          DEFAULT: "#e8d29e",
          soft: "#ceb87f",
          dim: "#a28b53",
        },
      },
      boxShadow: {
        gold: "0 0 15px rgba(216,178,90,0.35)",
        panel: "0 10px 30px rgba(0,0,0,0.35)",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        ui: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-myst": "radial-gradient(circle at top center, #1a0833, #0a0214 70%)",
        "panel-grad": "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        "ring-grad":
          "radial-gradient(100% 60% at 30% 20%, rgba(245,210,160,0.25), transparent 40%), linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      },
    },
  },
  plugins: [],
};
