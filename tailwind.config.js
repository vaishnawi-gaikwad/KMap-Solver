/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kmap-dark': '#07110F',
        'kmap-card': '#172A27',
        'kmap-card-hover': '#1F3834',
        'kmap-header': '#0F2622',
        'kmap-teal': '#4FC3B8',
        'kmap-teal-light': '#69E3D8',
        'kmap-teal-dark': '#0E3632',
        'kmap-border': '#22423D',
        'kmap-border-active': '#346961',
        'kmap-muted': '#8BA8A3',
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
