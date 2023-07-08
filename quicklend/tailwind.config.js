/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('/assets/img/fondoLogin.jpg')",
      }
    },
  },
  plugins: [],
}

