/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { colors: { ivory: '#f7f5ef', forest: '#354b3b', ink: '#252823', muted: '#77796f' }, fontFamily: { sans: ['DM Sans', 'sans-serif'], serif: ['Playfair Display', 'Georgia', 'serif'] } } },
  plugins: [],
}
