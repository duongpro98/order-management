'use client'
import DropDown from "@/utils/components/DropDown";
import Loading from "@/utils/icon/Loading";
import React, {useState} from "react";
import ProductDetail from "@/components/Order/ProductDetail";
import Button from "@/utils/components/Button";
import MyDatePicker from "@/utils/components/DatePicker";
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {addOrders} from "@/services";

interface orderComponent {
    listCustomers: any,
    listProducts: any
}

interface order {
    id: string,
    name: string,
    amount: number,
    price: number,
    total: number
}


const Order:React.FC<orderComponent> = ({ listCustomers, listProducts }) => {
    const emptyOrder = {
        id: uuidv4(),
        name: "",
        amount: 0,
        price: 0,
        total: 0
    }
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState("");
    const [orders, setOrders] = useState<order[]>([]);
    const [loading, setLoading] = useState(false);
    const buttonStyle = "text-white font-bold py-2 px-4 rounded-md"
    const viewStyle = " bg-green-500 hover:bg-green-400"

    const handleChangeOrder = (type: string, index: number, value: string) => {
        let newOrders = [...orders] as any;
        newOrders[index][type] = value;
        setOrders([...newOrders]);
    }

    const deleteOrder = (id: string) => {
        const updatedRows = orders.filter((order) => order.id !== id);
        setOrders(updatedRows);
    };

    const handleButtonClick = () => {
        setOrders([...orders, emptyOrder]);
    };

    const handleChangeCustomer = (value: string) => {
        setCustomer(value);
    }

    const handleChangeDate = (date: any) => {
        setDate(format(date, 'dd/MM/yyyy'));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await addOrders({
            customer,
            date,
            orders
        })
        console.log("create order successfully")
    }

    return (
        <>
            <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
                {/*Customer*/}
                <div className="mb-4">
                    <div className={'font-bold mb-1'}>Customer: </div>
                    <DropDown data={listCustomers} index={51} handleChange={handleChangeCustomer}/>
                </div>
                {/*Orders*/}
                <div className="mb-4">
                    <div className={'font-bold mb-3'}>Date: </div>
                    <MyDatePicker handleChangeValue={handleChangeDate}/>
                </div>
                <div className="mb-3 font-bold">
                    Order:
                </div>
                <div className="mb-4 flex flex-col justify-between border rounded-xl border-green-300 p-5">
                    {
                        orders.map((order, idx) => (
                            <ProductDetail
                                listProducts={listProducts}
                                key={order.id}
                                index={48 - idx}
                                priority={idx}
                                handleChangeOrder={handleChangeOrder}
                                deleteOrder={() => deleteOrder(order.id)}
                            />
                        ))
                    }
                    <div className="flex mt-4">
                        <Button className={buttonStyle + viewStyle} onClick={() => handleButtonClick()}>Thêm</Button>
                    </div>
                </div>
                {/*Footer*/}
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
        </>
    )
}

export default Order;
