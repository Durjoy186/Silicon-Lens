/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        bn: ['Hind Siliguri', 'sans-serif'],
      },
      colors: {
        workbench: '#f8fafc',
      }
    },
  },
  plugins: [],
}
