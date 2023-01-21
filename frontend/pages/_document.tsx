import {Html, Head, Main, NextScript} from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital@0;1&family=Roboto+Slab:wght@300;400;700&family=Roboto:ital,wght@0,300;0,400;0,700;1,400&display=swap"
                    rel="stylesheet"/>

                <link
                    href="./favicons/apple-touch-icon.png"
                    rel="apple-touch-icon"
                    sizes="180x180"
                />
                <link
                    href="./favicons/favicon-32x32.png"
                    rel="icon"
                    sizes="32x32"
                    type="image/png"
                />
                <link
                    href="./favicons/favicon-16x16.png"
                    rel="icon"
                    sizes="16x16"
                    type="image/png"
                />
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}
