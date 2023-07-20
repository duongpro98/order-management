'use client'

import React, {useEffect, useState} from "react";
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

    const handleTabClosure = async (e: any) => {
        e.preventDefault();
        if (session) {
            await signOut()
        }
    };

    useEffect(() => {
        if(session){
            const idleInterval = setInterval(idleTimeIncrement, 60000); // 1 minute
            // listen key and mouse events
            DOCUMENT_EVENTS.forEach(event => document.addEventListener(event, resetIdleTime));
            window.addEventListener("beforeunload", handleTabClosure);
            window.addEventListener("unload", handleTabClosure);
            return () => {
                // remove listener
                DOCUMENT_EVENTS.forEach(event => document.removeEventListener(event, resetIdleTime));
                window.removeEventListener("beforeunload", handleTabClosure);
                window.removeEventListener("unload", handleTabClosure);
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
        <div className={styles.container}>
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
                        <>
                            <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                                 src="/duong.jpg" alt="Bordered avatar"/>
                            <button className={styles.item} onClick={() => signOut()}>Sign Out</button>
                        </>
                    ): (
                        <button className={styles.item} onClick={() => signIn()}>Sign In</button>
                    )
                }
            </div>
        </div>
    )
}

export default Header;