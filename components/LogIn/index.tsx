'use client'

import React, { useRef } from 'react';
import {signIn} from "next-auth/react";
import {useSearchParams} from "next/navigation";


const Login: React.FC = () => {
    const usernameRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const searchParams = useSearchParams()

    const search = searchParams?.get('callbackUrl');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Access the input values using the ref objects
        const username = usernameRef.current?.value;
        const email = emailRef.current?.value;
        // Perform login logic
        const result = await signIn("credentials", {
            username: username,
            password: email,
            redirect: true,
            callbackUrl: search as any
        })
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        ref={usernameRef}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        // type="email"
                        placeholder="Enter your email"
                        ref={emailRef}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
