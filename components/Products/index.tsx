'use client'
import {database} from '@/data/firebase';
import {deleteDoc, doc, setDoc} from '@firebase/firestore';
import React, {useState} from 'react';
import Link from "next/link";
import Button from "@/utils/components/Button";
import {getData, searchProduct} from "@/services";
import {toast} from "react-toastify";
import Popup from "@/utils/components/Popup";
import usePagination from "@/utils/custome-hooks/usePagination";
import Pagination from "@/utils/components/Pagination";
import SearchBar from "@/utils/components/SearchBar";
import {convertDateOrder} from "@/utils/helper/orderHelper";

interface productComponent {
    items: any
}

const Products:React.FC<productComponent> = ({ items }) => {
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
    } = usePagination(setData as any, "products", "name", 'asc', items[items.length - 1]);
    const buttonStyle = "text-white font-bold py-2 px-4 rounded-2xl"
    const viewStyle = " bg-blue-500 hover:bg-blue-400"
    const deleteStyle = " bg-red-500 hover:bg-red-400"
    const createStyle = " bg-green-500 hover:bg-green-400"

    const refreshData = async (id: string, item: any) => {
        try {
            console.log("item ", item)
            let itemUpdate = data.map((it: any) => {
                if(it.id === id){
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

    const handleUpdate = async (id: string, data: any) => {
        try{
            // add document
            const productRef: any = doc(database, "products", id);
            await setDoc(productRef, data);
            // refresh the data
            await refreshData(id, data);
            toast.success("Cập nhật thành công");
            handleClosePopUp();
        }catch (err: any){
            toast.error(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // delete document
            const productDelete = doc(database, "products", id);
            await deleteDoc(productDelete);
            // refresh the data
            const newArray = data.filter(obj => obj.id !== id);
            setData(newArray)
            toast.success("Xóa thành công");
            handleClosePopUp();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleOpenPopUp = (type: string, item: any) => {
        setPopupStatus(type);
        setSelectedItem(item);
    }

    const handleClosePopUp = () => {
        setPopupStatus("");
    }

    const handleSearch = async (searchTerm: string) => {
        if(searchTerm){
            const searchedProduct = await searchProduct(searchTerm);
            setDataBeforeSearch(data);
            setData(searchedProduct);
            setSearching(true);
        }
    };

    const handleCloseSearch = () => {
        setData(dataBeforeSearch);
        setSearching(false);
    }

    return (
        <>
            <div className="flex justify-center p-6">
                <div className="flex flex-col items-start p-6">
                    <SearchBar onSearch={handleSearch} searching={searching} onCancelSearch={handleCloseSearch} searchType={"text"}/>
                    <table className="table-auto bg-white">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Stt</th>
                            <th className="py-2 px-4 border-b text-left">Tên sản phẩm</th>
                            <th className="py-2 px-4 border-b text-left">Số lượng</th>
                            <th className="py-2 px-4 border-b text-left">
                                <Link href={"/create-product"}>
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
                                    <td className="py-2 px-4 border-b">{item.amount}</td>
                                    <td className="py-2 px-4 border-b">
                                        <Button
                                            className={buttonStyle + viewStyle}
                                            onClick={() => handleOpenPopUp('update', item)}
                                        >
                                            Sửa
                                        </Button>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <Button
                                            className={buttonStyle + deleteStyle}
                                            onClick={() => handleOpenPopUp('delete', item)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
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

            {
                selectedItem && (popupStatus === 'update' || popupStatus === 'delete') &&  <Popup
                    isOpen={true}
                    onClose={handleClosePopUp}
                    type={popupStatus}
                    item={selectedItem}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            }

        </>
    )
}

export default Products