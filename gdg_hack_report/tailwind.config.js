/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'edu-blue': '#1e40af',
        'edu-dark-blue': '#0f172a',
        'edu-slate': '#475569',
        'edu-light-slate': '#e2e8f0',
        'edu-green': '#059669',
        'edu-light-green': '#d1fae5',
      },
    },
  },
  plugins: [],
}
