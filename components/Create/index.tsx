'use client'
import React from "react";
import Input from "@/utils/components/Input";
import {useState} from "react";
import {collection, addDoc, doc, setDoc} from "@firebase/firestore";
import Loading from "@/utils/icon/Loading";
import {database} from "@/data/firebase";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

interface createCustomerComponent {
    item?: any,
    refreshData?: any,
    handleClosePopup?: any
}

const Create:React.FC<createCustomerComponent> = ({ item, refreshData, handleClosePopup }) => {
    const router = useRouter();
    const [name, setName] = useState<string>(item?.name || "");
    const [phone, setPhone] = useState<string>(item?.phone || "");
    const [address, setAddress] = useState<string>(item?.address || "");
    const [loading, setLoading] = useState("");

    const handleNameChange = (value: string) => {
        setName(value);
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
    };

    const handleAddressChange = (value: string) => {
        setAddress(value);
    };

    const handleSuccessRequest = (message: string, item?: any) => {
        setTimeout(() => {
            setLoading("");
            if(handleClosePopup){
                refreshData(item);
                handleClosePopup();
            }else {
                router.push('/');
            }
            toast.success(message);
        }, 3000)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading("create");
        try{
            const data = {
                phone,
                address,
                name,
                createdAt: new Date()
            };
            const customers: any = collection(database, "customers");
            await addDoc(customers, data);
            handleSuccessRequest("Tạo khách hàng thành công");
        }catch (err: any){
            toast.error(err.message);
        }
    }

    const handleUpdate = async (id: string) => {
        setLoading("update");
        try{
            // update document
            const updateCustomer = {
                phone,
                address,
                name
            }
            const customerRef: any = doc(database, "customers", id);
            await setDoc(customerRef, updateCustomer);
            // refresh the data
            handleSuccessRequest("Cập nhật khách hàng thành công", {id, ...updateCustomer});
        }catch (err: any){
            toast.error(err.message);
        }
    };

    return (
        <form className="mt-5 max-w-xs mx-auto sm:max-w-sm" onSubmit={handleSubmit}>
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
                {
                    item ? (
                        <>
                            <button
                                className="mr-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={() => handleUpdate(item.id)}
                            >
                                {(loading === "update") && <Loading/>}
                                Sửa
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={() => handleClosePopup()}
                            >
                                Đóng
                            </button>
                        </>
                    ): (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            {(loading === 'create') && <Loading/>}
                            Submit
                        </button>
                    )
                }
            </div>
        </form>
    )
}

export default Create;
