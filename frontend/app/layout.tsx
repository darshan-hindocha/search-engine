import "./globals.css";
import Navbar from "../components/Navbar";

function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <>
            <body className="bg-bespoke-light-ivory">
            <Navbar/>
            <div className="min-h-screen">
                {children}
            </div>
            </body>
        </>
    )
}

export default RootLayout;