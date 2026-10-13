/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        os: {
          bg: "#020807",       // same deep teal-black as the reference
          panel: "#061210",
          border: "#17302b",
          accent: "#00f0ff",
          textMain: "#e0e0e0",
          textMuted: "#6b8580",
        },
      },
      fontFamily: {
        mono: ["var(--font-space-mono)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};