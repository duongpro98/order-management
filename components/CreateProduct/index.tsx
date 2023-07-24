'use client'
import Input from "@/utils/components/Input";
import {useState} from "react";
import {collection, addDoc} from "@firebase/firestore";
import Loading from "@/utils/icon/Loading";
import {database} from "@/data/firebase";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";


export default function CreateProduct() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNameChange = (value: string) => {
        setName(value);
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
    };


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
            setTimeout(() => {
                setLoading(false);
                router.push('/inventory');
                toast.success("Thêm hàng vào kho thành công");
            }, 3000)
        }catch (err: any){
            toast.error(err.message);
        }
    }

    return (
        <form className="mt-5 max-w-xs mx-auto sm:max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
                <Input label={"Name"} value={name} onChange={handleNameChange}/>
            </div>
            <div className="mb-4">
                <Input label={"Amount"} onlyNumber={true} value={amount} onChange={handleAmountChange}/>
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    {loading && <Loading/>}
                    Submit
                </button>
            </div>
        </form>
    )
}
