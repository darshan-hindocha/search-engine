import Link from "next/link";

export default function Navbar() {
    return (
        <div className=" bg-amber-600">
            <nav className="container mx-auto p-6">
                <ul className="flex space-x-6 text-lg">
                    <li>
                        <NavLink href="/">
                            <h2 className="font-dancingScript">
                                Kavita
                            </h2>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

type NavLink = {
    href: string;
    children: React.ReactNode;
};

const NavLink = ({href, children}: NavLink) => {
    return (
        <Link className="hover:text-gray-300 hover:underline" href={href}>
            {children}
        </Link>
    );
};