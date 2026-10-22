/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          light: '#eff6ff', // blue-50
          DEFAULT: '#2563eb', // blue-600
          hover: '#1d4ed8', // blue-700
          dark: '#1e3a8a', // blue-900
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 10px 20px -3px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
