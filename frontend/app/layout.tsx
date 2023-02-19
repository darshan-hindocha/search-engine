import "./globals.css";
import Navbar from "../components/Navbar";

function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <>
            <body>
            <Navbar/>
            <div className="min-h-screen bg-bespoke-light-ivory">
                {children}
            </div>
            </body>
        </>
    )
}

export default RootLayout;