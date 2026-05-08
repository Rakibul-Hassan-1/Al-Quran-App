/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f1117",
          surface: "#1a1d27",
          card: "#21253a",
          border: "#2d3250",
          hover: "#2a2f47",
        },
        accent: {
          gold: "#c9a84c",
          "gold-light": "#e8c96c",
          green: "#4caf82",
          blue: "#5b8dee",
        },
      },
      fontFamily: {
        arabic: ["var(--font-amiri)", "serif"],
        "arabic-kfgq": ["var(--font-kfgq)", "serif"],
        "arabic-scheherazade": ["var(--font-scheherazade)", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
