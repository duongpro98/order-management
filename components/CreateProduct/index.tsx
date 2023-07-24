'use client'
import Input from "@/utils/components/Input";
import React, {useState} from "react";
import {collection, addDoc, doc, setDoc} from "@firebase/firestore";
import Loading from "@/utils/icon/Loading";
import {database} from "@/data/firebase";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

interface productComponent {
    item?: any,
    handleClosePopup?: any,
    refreshData?: any
}

const CreateProduct:React.FC<productComponent> = ({ item, handleClosePopup, refreshData }) => {
    const router = useRouter();
    const [name, setName] = useState<string>(item?.name || "");
    const [amount, setAmount] = useState<any>(item?.amount || "");
    const [loading, setLoading] = useState("");

    const handleNameChange = (value: string) => {
        setName(value);
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
    };

    const handleSuccessRequest = (message: string, item?: any) => {
        setTimeout(() => {
            setLoading("");
            if(handleClosePopup){
                refreshData(item);
                handleClosePopup();
            }else {
                router.push('/inventory');
            }
            toast.success(message);
        }, 3000)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try{
            const data = {
                name,
                amount,
                createdAt: new Date()
            };
            const products: any = collection(database, "products");
            await addDoc(products, data);
            handleSuccessRequest("Thêm hàng vào kho thành công");
        }catch (err: any){
            toast.error(err.message);
        }
    }

    const handleUpdate = async (id: string) => {
        setLoading("update");
        try{
            // update document
            const updateProduct = {
                name,
                amount
            }
            const productRef: any = doc(database, "products", id);
            await setDoc(productRef, updateProduct);
            // refresh the data
            handleSuccessRequest("Cập nhật sản phẩm thành công", {id, ...updateProduct});
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
                <Input label={"Amount"} onlyNumber={true} value={amount} onChange={handleAmountChange}/>
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

export default CreateProduct;
