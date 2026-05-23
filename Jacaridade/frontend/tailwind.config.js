/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          bg: '#fdfaf6',
          card: '#ffffff',
          accent: '#a5a5e1',
          text: '#5d576b',
          'pastel-green': '#e2f0cb',
          'pastel-pink': '#f7d9d9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
