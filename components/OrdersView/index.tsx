'use client'
import React, {useState} from "react";
import Link from "next/link";
import Button from "@/utils/components/Button";
import {deleteDoc, doc} from "@firebase/firestore";
import {database} from "@/data/firebase";
import {getOrders} from "@/services";
import {calculateTotalPrice} from "@/utils/helper/orderHelper";

interface orderComponent {
    listOrders: any
}

const Orders:React.FC<orderComponent> = ({listOrders}) => {
    const [data, setData] = useState(listOrders);
    const buttonStyle = "text-white font-bold py-2 px-4 rounded-2xl"
    const createStyle = " bg-green-500 hover:bg-green-400"
    const viewStyle = " bg-blue-500 hover:bg-blue-400"
    const deleteStyle = " bg-red-500 hover:bg-red-400"

    const handleDelete = async (id: string) => {
        try {
            // delete document
            const orderDelete = doc(database, "orders", id);
            await deleteDoc(orderDelete);
            // refresh the data
            const newData = await getOrders();
            setData(newData)
            console.log("delete success")
        } catch (err) {
            console.log("err ", err)
        }
    }

    return (
        <div className="flex justify-center p-6">
            <div className="flex flex-col items-start p-6">
                <table className="table-auto bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Stt</th>
                        <th className="py-2 px-4 border-b text-left">Mã hóa đơn</th>
                        <th className="py-2 px-4 border-b text-left">Tên khách hàng</th>
                        <th className="py-2 px-4 border-b text-left">Ngày hóa đơn</th>
                        <th className="py-2 px-4 border-b text-left">Tổng tiền</th>
                        <th className="py-2 px-4 border-b text-left">
                            <Link href={"/create-order"}>
                                <Button className={buttonStyle + createStyle}>Tạo</Button>
                            </Link>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="py-2 px-4 border-b">{idx + 1}</td>
                                <td className="py-2 px-4 border-b">{item.id}</td>
                                <td className="py-2 px-4 border-b">{item.customer}</td>
                                <td className="py-2 px-4 border-b">{item.date.toString()}</td>
                                <td className="py-2 px-4 border-b">{calculateTotalPrice(item.orders)}</td>
                                <td className="py-2 px-4 border-b">
                                    <Button className={buttonStyle + viewStyle}>Xem</Button>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <Button
                                        className={buttonStyle + deleteStyle}
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Orders;
