'use client'
import Input from "@/utils/components/Input";
import {useState} from "react";
import {collection, addDoc} from "@firebase/firestore";
import Loading from "@/utils/icon/Loading";
import {database} from "@/data/firebase";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";


export default function Create() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try{
            const data = {
                phone,
                address,
                name
            };
            const customers: any = collection(database, "customers");
            await addDoc(customers, data);
            setTimeout(() => {
                setLoading(false);
                router.push('/');
                toast.success("Tạo khách hàng thành công");
            }, 3000)
        }catch (err){
            toast.error(err.message);
        }
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
                    {loading && <Loading/>}
                    Submit
                </button>
            </div>
        </form>
    )
}
