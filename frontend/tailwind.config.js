/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gray: {
                    50: '#f0f6fc',
                    100: '#C2C8CF',
                    200: '#9BA2AA',
                    300: '#7D7D7F',
                    400: '#30363d',
                    500: '#30363D',
                    600: '#30363D',
                    700: '#151a22',
                    800: '#0d1116',
                    900: '#01040a',
                },
                green: {
                    light: '#f78166',
                    mid: '#238636',
                    dark: '#242710',
                }
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
