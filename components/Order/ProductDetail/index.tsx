'use client'
import DropDown from "@/utils/components/DropDown";
import Input from "@/utils/components/Input";
import React, {useState} from "react";
import Button from "@/utils/components/Button";

interface productDetailComponent {
    index: number
    item?: any
    priority: number
    listProducts: any
    handleChangeOrder?: any
    deleteOrder?: any
    isFinished: boolean
}

const ProductDetail:React.FC<productDetailComponent> = ({ item, index, priority, listProducts, handleChangeOrder, deleteOrder, isFinished }) => {
    const [amount, setAmount] = useState(item.amount || "");
    const [price, setPrice] = useState(item.price || "");

    const handleChangeAmount = (value: string) => {
        setAmount(value)
        handleChangeOrder("amount", priority, parseFloat(value))
    };

    const handleChangePrice = (value: string) => {
        setPrice(value)
        handleChangeOrder("price", priority, parseFloat(value))
    };

    return (
        <div className={`flex flex-col ${priority > 0? 'mt-3': ''}`}>
            <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 md:col-span-4">
                    <div className={'font-bold'}>Product: </div>
                    <DropDown data={listProducts} value={item.name} index={index} idx={priority} handleChangeOther={handleChangeOrder} disabled={isFinished}/>
                </div>
                <div className="col-span-6 md:col-span-3">
                    <Input label={"Amount"} value={amount} onChange={handleChangeAmount} onlyNumber={true} disabled={isFinished}/>
                </div>
                <div className="col-span-6 md:col-span-3">
                    <Input label={"Price"} value={price} onChange={handleChangePrice} onlyNumber={true} disabled={isFinished}/>
                </div>
                {
                    !isFinished && (
                        <div className="col-span-3 md:col-span-2">
                            <Button className="text-white font-bold py-2 px-4 rounded-md bg-red-500 hover:bg-red-400" onClick={deleteOrder}>Xóa</Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProductDetail;
