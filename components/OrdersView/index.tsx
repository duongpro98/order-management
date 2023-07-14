'use client'
import React, {useState} from "react";
import Link from "next/link";
import Button from "@/utils/components/Button";
import {deleteDoc, doc} from "@firebase/firestore";
import {database} from "@/data/firebase";
import {calculateTotalPrice, convertDateOrder} from "@/utils/helper/orderHelper";
import Popup from "@/utils/components/Popup";
import CreateOrder from "@/components/Order";
import {toast} from "react-toastify";
import usePagination from "@/utils/custome-hooks/usePagination";
import {format} from "date-fns";
import Pagination from "@/utils/components/Pagination";
import MyDatePicker from "@/utils/components/DatePicker";
import {searchOrder} from "@/services";

interface orderComponent {
    listOrders: any
}

const Orders: React.FC<orderComponent> = ({listOrders}) => {
    const [data, setData] = useState(listOrders);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const {
        currentPage,
        totalPages,
        handlePreviousPage,
        handleNextPage
    } = usePagination(setData as any, "orders", "date", 'desc', listOrders[listOrders.length - 1]);
    const buttonStyle = "text-white font-bold py-2 px-4 rounded-2xl"
    const createStyle = " bg-green-500 hover:bg-green-400"
    const viewStyle = " bg-blue-500 hover:bg-blue-400"
    const deleteStyle = " bg-red-500 hover:bg-red-400"

    const refreshOrder = async (item: any) => {
        try {
            let itemUpdate = data.map((it: any) => {
                if(it.id === item.id){
                    return  {
                        ...it,
                        ...item
                    }
                }
                else {
                    return it
                }
            });
            setData(convertDateOrder(itemUpdate));
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            // delete document
            const orderDelete = doc(database, "orders", id);
            await deleteDoc(orderDelete);
            // refresh the data
            const newArray = data.filter((obj: any) => obj.id !== id);
            setData(newArray)
            toast.success("delete success")
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleClosePopUp = () => {
        setOpenEdit(false);
    }

    const handleOpenEdit = (item: any) => {
        setOpenEdit(true);
        setSelectedItem(item);
    }

    const handleChangeStartDate = (date: any) => {
        setStartDate(date);
    }

    const handleChangeEndDate = (date: any) => {
        setEndDate(date);
    }

    const handleSearchOrder = async () => {
        const searchedOrder = await searchOrder(startDate, endDate);
        setData(searchedOrder)
    }

    return (
        <>
            <div className="flex justify-center p-6">
                <div className="flex flex-col items-start p-6">
                    <div className="flex items-center">
                        <MyDatePicker value={startDate} handleChangeValue={handleChangeStartDate}/>
                        <div className="mx-5">Đến</div>
                        <MyDatePicker value={endDate} handleChangeValue={handleChangeEndDate}/>
                        <button
                            type="button"
                            className="ml-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
                            onClick={() => handleSearchOrder()}
                        >
                            Tìm
                        </button>
                        <button
                            type="button"
                            className="ml-5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2"
                        >
                            Hủy tìm
                        </button>
                    </div>
                    <table className="table-auto bg-white">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Stt</th>
                            <th className="py-2 px-4 border-b text-left">Mã hóa đơn</th>
                            <th className="py-2 px-4 border-b text-left">Tên khách hàng</th>
                            <th className="py-2 px-4 border-b text-left">Ngày hóa đơn</th>
                            <th className="py-2 px-4 border-b text-left">Tổng tiền</th>
                            <th className="py-2 px-4 border-b text-left">Tình trạng</th>
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
                                    <td className="py-2 px-4 border-b">{format(item.date, 'dd/MM/yyyy')}</td>
                                    <td className="py-2 px-4 border-b">{calculateTotalPrice(item.orders)}</td>
                                    <td className="py-2 px-4 border-b">{item.status || 'Chờ'}</td>
                                    <td className="py-2 px-4 border-b">
                                        <Button
                                            className={buttonStyle + viewStyle}
                                            onClick={() => handleOpenEdit(item)}
                                        >
                                            Xem
                                        </Button>
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
            {
                selectedItem && openEdit && <Popup
                    isOpen={true}
                    onClose={handleClosePopUp}
                >
                    <CreateOrder
                        item={selectedItem}
                        handleClosePopup={handleClosePopUp}
                        refreshData={refreshOrder}
                    />
                </Popup>
            }
        </>
    )
}

export default Orders;
