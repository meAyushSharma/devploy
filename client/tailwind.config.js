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
        'empty-screen':"url('https://res.cloudinary.com/dubrgx4b1/image/upload/v1737031281/gjfzwbpiwysluosachu5.png')",
        "empty-elements":"url('https://res.cloudinary.com/dubrgx4b1/image/upload/v1739096355/rjmbumgi5nxgow0gxc5s.png')",
      },
      colors: {
        "soft-white": "#fefffe",
        "soft-dark":"#111",
        "format-code-dark":"#17191E",
        "soft-indigo":"#cdb4db",
        "soft-brown":"#efd780",
        "soft-green":"#ccd5ae",
      }
    },
  },
  plugins: [],
}

