'use client'
import {database} from '@/data/firebase';
import {
    deleteDoc,
    doc,
} from '@firebase/firestore';
import React, {useState} from 'react';
import Link from "next/link";
import Button from "@/utils/components/Button";
import {toast} from "react-toastify";
import Pagination from "@/utils/components/Pagination";
import usePagination from "@/utils/custome-hooks/usePagination";

interface customerComponent {
    items: any
}

const Customers:React.FC<customerComponent> = ({ items }) => {
    const [data, setData] = useState<any[]>(items || []);
    const {
        currentPage,
        totalPages,
        handlePreviousPage,
        handleNextPage
    } = usePagination(setData as any, "customers", "name", 'asc', items[items.length - 1]);
    const buttonStyle = "text-white font-bold py-2 px-4 rounded-2xl"
    const viewStyle = " bg-blue-500 hover:bg-blue-400"
    const deleteStyle = " bg-red-500 hover:bg-red-400"
    const createStyle = " bg-green-500 hover:bg-green-400"

    const handleDelete = async (id: string) => {
        try {
            // delete document
            const customerDelete = doc(database, "customers", id);
            await deleteDoc(customerDelete);
            // refresh the data
            const newArray = data.filter(obj => obj.id !== id);
            setData(newArray)
            toast.success("Xóa thành công");
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    return (
        <div className="flex justify-center p-6">
            <div className="flex flex-col items-start p-6">
                <Link href={"/create-order"}>
                    <Button className={buttonStyle + createStyle}>Tạo đơn</Button>
                </Link>
                <table className="table-auto bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Stt</th>
                        <th className="py-2 px-4 border-b text-left">Tên khách hàng</th>
                        <th className="py-2 px-4 border-b text-left">Tổng hóa đơn</th>
                        <th className="py-2 px-4 border-b text-left">Tổng doanh thu</th>
                        <th className="py-2 px-4 border-b text-left">Sđt</th>
                        <th className="py-2 px-4 border-b text-left">
                            <Link href={"/create"}>
                                <Button className={buttonStyle + createStyle}>Tạo</Button>
                            </Link>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-2 px-4 border-b">{idx + 1}</td>
                                <td className="py-2 px-4 border-b">{item.name}</td>
                                <td className="py-2 px-4 border-b">0</td>
                                <td className="py-2 px-4 border-b">0</td>
                                <td className="py-2 px-4 border-b">{item.phone}</td>
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                />
            </div>
        </div>
    )
}

export default Customers