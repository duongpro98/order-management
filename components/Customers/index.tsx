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
import SearchBar from "@/utils/components/SearchBar";
import {searchCustomer} from "@/services";
import {formatToVND} from "@/utils/helper/orderHelper";
import Popup from "@/utils/components/Popup";
import Create from "@/components/Create";

interface customerComponent {
    items: any
}

const Customers:React.FC<customerComponent> = ({ items }) => {
    const [data, setData] = useState<any[]>(items || []);
    const [searching, setSearching] = useState(false);
    const [dataBeforeSearch, setDataBeforeSearch] = useState<any[]>([]);
    const [popupStatus, setPopupStatus] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
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
            handleClosePopUp();
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    const handleSearch = async (searchTerm: string) => {
        if(searchTerm){
            const searchedCustomer = await searchCustomer(searchTerm);
            if(!searching){
                setDataBeforeSearch(data);
            }
            setData(searchedCustomer);
            setSearching(true);
        }
    };

    const refreshCustomer = async (item: any) => {
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
            setData(itemUpdate);
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleCloseSearch = () => {
        setData(dataBeforeSearch);
        setSearching(false);
    }

    const handleClosePopUp = () => {
        setPopupStatus("");
    }

    const handleOpenPopUp = (type: string, item: any) => {
        setPopupStatus(type)
        setSelectedItem(item);
    }

    return (
        <>
            <div className="flex justify-center p-6">
                <div className="flex flex-col items-center p-6 w-full">
                    <div className="flex flex-col max-w-full">
                        <SearchBar onSearch={handleSearch} searching={searching} onCancelSearch={handleCloseSearch} searchType={"text"}/>
                        <Link href={"/create-order"}>
                            <Button className={buttonStyle + createStyle}>Tạo đơn</Button>
                        </Link>
                        <div className="flex max-w-full overflow-x-auto">
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
                                            <td className="py-2 px-4 border-b">{item.totalOrder}</td>
                                            <td className="py-2 px-4 border-b">{formatToVND(item.totalRevenue)}</td>
                                            <td className="py-2 px-4 border-b">{item.phone}</td>
                                            <td className="py-2 px-4 border-b">
                                                <Button
                                                    className={buttonStyle + viewStyle}
                                                    onClick={() => handleOpenPopUp("update", item)}
                                                >
                                                    Xem
                                                </Button>
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <Button
                                                    className={buttonStyle + deleteStyle}
                                                    onClick={() => handleOpenPopUp("delete", item)}
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
                        {
                            !searching && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    handlePreviousPage={handlePreviousPage}
                                    handleNextPage={handleNextPage}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
            {
                selectedItem && (popupStatus === 'update' || popupStatus === 'delete') && <Popup
                    isOpen={true}
                    onClose={handleClosePopUp}
                    type={popupStatus}
                    item={selectedItem}
                    onDelete={handleDelete}
                >
                    <Create
                        item={selectedItem}
                        handleClosePopup={handleClosePopUp}
                        refreshData={refreshCustomer}
                    />
                </Popup>
            }
        </>
    )
}

export default Customers