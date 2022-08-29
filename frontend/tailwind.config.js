/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      },
      fontFamily: {
        ovo: ["Ovo", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      spacing: {},
      fontSize: {
        h1Desktop: "50px",
        h2Desktop: "40px",
        h3Desktop: "30px",
        h4Desktop: "20px",
        baseDesktop: ["16px", "22px"],
        h1Mobile: "34px",
        h2Mobile: "30px",
        h3Mobile: "25px",
        h4Mobile: "20px",
        baseMobile: "16px",
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
  important: "#__next",
};
