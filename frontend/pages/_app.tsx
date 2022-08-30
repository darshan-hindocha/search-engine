import "../styles/globals.css";
import type {AppProps} from "next/app";
import {ThemeProvider as NextTheme} from 'next-themes';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {AuthProvider} from "../context/auth";

const theme = createTheme({
    palette: {
        primary: {
            light: '#f78166',
            main: '#238636',
            dark: '#242710',
            contrastText: '#fff'
        },
        secondary: {
            light: '#a1887f',
            main: '#5d4037',
            dark: '#3e2723',
            contrastText: '#fff'
        },
        info: {
            light: '#ffab91',
            main: '#ff5722',
            dark: '#bf360c',
        },
        grey: {
            50: '#f0f6fc',
            100: '#C2C8CF',
            200: '#9BA2AA',
            300: '#7D7D7F',
            400: '#393E46',
            500: '#30363d',
            600: '#232931',
            700: '#151a22',
            800: '#0d1116',
            900: '#01040a',
        },
        background: {
            paper: '#f0f6fc',
            default: '#f0f6fc'
        }
    },
    shape: {
        borderRadius: 12
    }
});

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <NextTheme attribute="class">
                <ThemeProvider theme={theme}>
                    <AuthProvider>
                        <Component {...pageProps} />
                    </AuthProvider>
                </ThemeProvider>
            </NextTheme>
        </>
    );
}

export default MyApp;
