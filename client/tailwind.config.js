/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cine: {
          red: '#f84464',
          'red-hover': '#e03657',
          'red-dark': '#c82647',
          'red-light': '#fff1f3',
          dark: '#1a1a24',
          darker: '#0f1017',
          navy: '#222436',
          gray: '#333545',
          lightgray: '#f5f5f7',
          border: 'rgba(255, 255, 255, 0.1)',
          text: '#222436',
          muted: '#666677',
        },
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f84464',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Baloo 2"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cine': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'cine-red': '0 8px 25px -4px rgba(248, 68, 100, 0.4)',
        'cine-glow': '0 0 20px rgba(248, 68, 100, 0.35)',
      }
    },
  },
  plugins: [],
}
