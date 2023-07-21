'use client'

import React, {useEffect, useState, useRef} from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import {useSession, signOut, signIn} from "next-auth/react";
import {usePathname} from "next/navigation";

const IDLE_TIME = 30; // 10 minutes
const DOCUMENT_EVENTS = ['click', 'scroll', 'mouseover', 'mousedown', 'keydown', 'touchstart'];

const Header: React.FC = () => {
    const {data: session} = useSession();
    const [expired, setExpired] = useState<any>(null);
    const [idleTime, setIdleTime] = useState(0);
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<any>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleBlur = (event: any) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    // This code handle checking authentication rapidly

    // useEffect(() => {
    //     if(session && expired === null){
    //         setExpired(session.expires);
    //     }
    // }, [session]);
    //
    // useEffect(() => {
    //     if(expired){
    //         const checkTokenExpiration = async () => {
    //             console.log("hello")
    //             const currentTime = Date.now();
    //             const expiredDate = new Date(expired)
    //             if (currentTime > expiredDate.getTime()) {
    //                 await signOut({
    //                     redirect: true,
    //                     callbackUrl: pathname as any
    //                 });
    //             }
    //         };
    //
    //         // Check token expiration every 1 minute (adjust as needed)
    //         const interval = setInterval(checkTokenExpiration, 10000);
    //
    //         const cleanup = () => {
    //             console.log("cleaning");
    //             clearInterval(interval);
    //         };
    //         return () => {
    //             cleanup();
    //         };
    //     }
    // }, [expired, pathname]);
    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('click', handleBlur);
        } else {
            document.removeEventListener('click', handleBlur);
        }

        return () => {
            document.removeEventListener('click', handleBlur);
        };
    }, [isMenuOpen]);

    useEffect(() => {
        if(session){
            const idleInterval = setInterval(idleTimeIncrement, 60000); // 1 minute
            // listen key and mouse events
            DOCUMENT_EVENTS.forEach(event => document.addEventListener(event, resetIdleTime));
            return () => {
                // remove listener
                DOCUMENT_EVENTS.forEach(event => document.removeEventListener(event, resetIdleTime));
                // remove interval
                clearInterval(idleInterval);
            }
        }
    }, [session]);


    // trigger silent login
    useEffect(() => {
        if(idleTime >= IDLE_TIME){
            signOut();
        }
    }, [idleTime]);

    // reset idle time
    const resetIdleTime = () => {
        setIdleTime(0);
    }

    // increase idle time
    const idleTimeIncrement = async () => {
        setIdleTime(prev => prev + 1);
    }


    return (
        <div className="flex items-center justify-between px-6 py-5 font-quick-san border-b shadow-md">
            <div className="relative flex justify-between w-full ml-5 md:hidden">
                <div className="flex items-center">
                    <button
                        className="text-gray-600 focus:outline-none focus:text-gray-900 mr-3"
                        onClick={toggleMenu}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                    <span className="uppercase text-left text-[20px] font-quick-san">CHICKEN DREAM</span>
                </div>
                <div>
                    <button className={styles.item} onClick={() => signOut()}>Sign Out</button>
                </div>
                {isMenuOpen && (
                    <div
                        ref={menuRef}
                        className="absolute left-6 top-0 mt-2 py-2 w-48 bg-white border rounded-lg shadow-lg z-101 flex flex-col"
                    >
                        {/* Add your mobile menu content (links) here */}
                        <Link href="/" className={styles.item}>
                            Home
                        </Link>
                        <Link href="/order" className={styles.item}>
                            Order
                        </Link>
                        <Link href="/inventory" className={styles.item}>
                            Kho
                        </Link>
                        {/* Add more menu items (links) as needed */}
                    </div>
                )}
            </div>
            <div className="hidden md:flex items-center justify-between px-6 py-5 font-quick-san w-full">
                <div className={styles.title}>CHICKEN DREAM</div>
                <div className={styles.itemContainer}>
                    <Link href="/" className={styles.item}>
                        Home
                    </Link>
                    <Link href="/order" className={styles.item}>
                        Order
                    </Link>
                    <Link href="/inventory" className={styles.item}>
                        Kho
                    </Link>
                    {
                        session?.user ? (
                            <div className="relative">
                                {/*<img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"*/}
                                {/*     src="/duong.jpg" alt="Bordered avatar"/>*/}
                                <button className={styles.item} onClick={() => signOut()}>Sign Out</button>
                            </div>
                        ): (
                            <button className={styles.item} onClick={() => signIn()}>Sign In</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Header;