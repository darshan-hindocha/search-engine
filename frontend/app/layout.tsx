import "./globals.css";

function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <>
            <body className="bg-[#C0D6BD]">
            <div className="min-h-screen">
                {children}
            </div>
            </body>
        </>
    )
}

export default RootLayout;