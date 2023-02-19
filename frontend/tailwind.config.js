/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
                },
                bespoke: {
                    'warm-golden-brown': '#967126',
                    'cool-grayish-brown': '#4F4A41',
                    'muted-olive-green': '#6B8E23',
                    'deep-reddish-brown': '#8B4513',
                    'light-sandy-brown': '#CD853F',
                    'light-ivory': '#F8F8FF',
                }
            },
            fontFamily: {
                roboto: ['Roboto', 'sans-serif'],
                robotoCondensed: ['Roboto Condensed', 'sans-serif'],
                robotoSlab: ['Roboto Slab', 'sans-serif'],
                dancingScript: ['Dancing Script', 'cursive'],
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
};
