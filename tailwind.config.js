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
        obsidian: '#090C10',
        card: '#12171F',
        cardHover: '#18202A',
        gold: {
          light: '#FFFFFF',
          DEFAULT: '#E4E4E7',
          dark: '#A1A1AA'
        },
        cyan: {
          glow: '#00F2FE'
        },
        titanium: '#8A95A5',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(255, 255, 255, 0.15)',
        'glow-cyan': '0 0 25px rgba(0, 242, 254, 0.25)',
        'glow-white': '0 0 30px rgba(255, 255, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
