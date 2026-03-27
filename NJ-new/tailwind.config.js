/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#f0ad4e',
        'brand-dark': '#1a1a1a',
        'brand-light': '#f8f9fa',
        'brand-gray': '#6c757d',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'mega': '0 10px 40px -10px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
