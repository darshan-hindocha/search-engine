import {ReactNode} from "react";
import Head from "next/head";
import NextLink from "next/link";
import cn from 'classnames';
import {useRouter} from "next/router";
import {useUser} from '@auth0/nextjs-auth0';

function NavItem({href, text}: { href: string, text: string }) {
    const router = useRouter();
    const isActive = router.asPath === href;

    return (
        <NextLink href={href}>
            <a
                className={cn(
                    isActive
                        ? 'font-semibold text-gray-900'
                        : 'font-normal text-gray-800',
                    'inline-block p-1 sm:py-2 rounded-lg hover:bg-gray-300 transition-all'
                )}
            >
                <span className="capsize">{text}</span>
            </a>
        </NextLink>
    );
}


export default function Container({children}: { children: ReactNode }) {
    const {user, error, isLoading} = useUser();

    const meta = {
        title: '(BETA) Search Engine',
        description: `(BETA) A search engine for Mandir content`,
        type: 'website',
    };
    return (
        <div>
            <Head>
                <title>{meta.title}</title>
                <meta name="robots" content="follow, index"/>
                <meta content={meta.description} name="description"/>
                <meta property="og:type" content={meta.type}/>
                <meta property="og:site_name" content="Mandir Search Engine"/>
                <meta property="og:description" content={meta.description}/>
                <meta property="og:title" content={meta.title}/>
            </Head>
            <nav
                className="fixed z-10 flex w-full justify-between px-4 md:px-10 py-2 bg-opacity-90 bg-gray-200"
            >
                <div>
                    <NavItem href="/" text="Home"/>
                    <NavItem href="/documents" text="Documents"/>
                </div>
                <div>
                    {user?.sid ?
                        <NavItem href="/api/auth/logout" text="Logout"/>
                        :
                        <NavItem href="/api/auth/login" text="Login"/>
                    }
                </div>
            </nav>
            <div className="flex flex-col sm:items-center">
                <main
                    className="flex flex-col my-20 justify-center sm:w-3/4 max-w-4xl px-4"
                >
                    {children}
                </main>
            </div>
        </div>
    )
}