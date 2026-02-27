/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#eff6ff', // blue-50
          DEFAULT: '#3b82f6', // blue-500
          dark: '#1e3a8a', // blue-900
        }
      }
    },
  },
  plugins: [],
}
