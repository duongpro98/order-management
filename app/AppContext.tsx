'use client'
import React from "react";
import { createContext , useState } from 'react';

// Create the context
type MyContextValue = {
    customers: string;
    updateCustomers: (newData: any) => void;
};
export const MyContext = createContext <MyContextValue | null>(null);

// Create a provider component
export const MyContextProvider:React.FC = ({ children }) => {
    const [customers, setCustomers] = useState<any>([]);

    const updateCustomers = (newData: any) => {
        setCustomers(newData);
    };

    const contextValue: MyContextValue = {
        customers,
        updateCustomers,
    };
    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};
