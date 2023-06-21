"use client";
import Image from 'next/image'
import Input from "@/utils/components/Input";
import {useState} from "react";
import {collection, getDocs} from "@firebase/firestore";
import {database} from "@/data/firebase";

export default function Create() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const userCollection = collection(database, "customers");

    const handleNameChange = (value: string) => {
        setName(value);
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
    };

    const handleAddressChange = (value: string) => {
        setAddress(value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const querySnapshot = await getDocs(userCollection);
        const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
        console.log(newData)
    }

    return (
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
                <Input label={"Name"} value={name} onChange={handleNameChange}/>
            </div>
            <div className="mb-4">
                <Input label={"Phone"} value={phone} onChange={handlePhoneChange}/>
            </div>
            <div className="mb-4">
                <Input label={"Address"} value={address} onChange={handleAddressChange}/>
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}
