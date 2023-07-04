'use client'
import DropDown from "@/utils/components/DropDown";
import Input from "@/utils/components/Input";
import React, {useState} from "react";
import Button from "@/utils/components/Button";

interface productDetailComponent {
    index: number
    priority: number
    listProducts: any
    handleChangeOrder?: any
    deleteOrder?: any
}

const ProductDetail:React.FC<productDetailComponent> = ({ index, priority, listProducts, handleChangeOrder, deleteOrder }) => {
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("");

    const handleChangeAmount = (value: string) => {
        setAmount(value)
        handleChangeOrder("amount", priority, value)
    };

    const handleChangePrice = (value: string) => {
        setPrice(value)
        handleChangeOrder("price", priority, value)
    };

    return (
        <div className={`flex flex-col ${priority > 0? 'mt-3': ''}`}>
            <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                    <div className={'font-bold'}>Product: </div>
                    <DropDown data={listProducts} index={index} idx={priority} handleChangeOther={handleChangeOrder}/>
                </div>
                <div className="col-span-3">
                    <Input label={"Amount"} value={amount} onChange={handleChangeAmount}/>
                </div>
                <div className="col-span-3">
                    <Input label={"Price"} value={price} onChange={handleChangePrice}/>
                </div>
                <div className="col-span-2">
                    <Button className="text-white font-bold py-2 px-4 rounded-md bg-red-500 hover:bg-red-400" onClick={deleteOrder}>Xóa</Button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;