/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        red: '#e11d48',
        dark: '#000000',
        obsidian: '#000000',
        'obsidian-card': '#121212',
        gold: '#c5a880',
        'gold-light': '#e2b77a'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        header: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: []
}

