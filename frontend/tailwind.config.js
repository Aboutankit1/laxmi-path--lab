/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f2f6f6",
          100: "#dfe9e8",
          200: "#b9cfcd",
          300: "#8fb0ad",
          400: "#5c8b87",
          500: "#3a6b67",
          600: "#245250",
          700: "#1a3f3f",
          800: "#122e2f",
          900: "#0b1f20",
          950: "#061415",
        },
        clay: {
          50: "#fef6f0",
          100: "#fdead9",
          200: "#fad0ac",
          300: "#f5ac74",
          400: "#ee8442",
          500: "#e2661f",
          600: "#c14f14",
          700: "#9c3d13",
          800: "#7c3216",
          900: "#652a15",
        },
        canvas: {
          light: "#f7f5f0",
          dark: "#0b1414",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,31,32,0.04), 0 4px 16px rgba(11,31,32,0.06)",
        card: "0 2px 8px rgba(11,31,32,0.06), 0 8px 24px rgba(11,31,32,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
