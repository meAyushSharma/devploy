/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Satoshi': ['Satoshi', 'sans-serif'],
      },
      backgroundImage: {
        'empty-screen':"url('https://res.cloudinary.com/dubrgx4b1/image/upload/v1737031281/gjfzwbpiwysluosachu5.png')"
      },
      colors: {
        "soft-white": "#fefffe",
        "soft-dark":"#111",
        "format-code-dark":"#17191E"
      }
    },
  },
  plugins: [],
}

