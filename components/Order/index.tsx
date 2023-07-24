'use client'
import DropDown from "@/utils/components/DropDown";
import Loading from "@/utils/icon/Loading";
import React, {useEffect, useState} from "react";
import ProductDetail from "@/components/Order/ProductDetail";
import Button from "@/utils/components/Button";
import MyDatePicker from "@/utils/components/DatePicker";
import { v4 as uuidv4 } from 'uuid';
import {getData} from "@/services";
import {addDoc, collection, doc, getDocs, query, setDoc, UpdateData, where} from "@firebase/firestore";
import {database} from "@/data/firebase";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {runTransaction} from "@firebase/firestore";
import {calculateTotalPrice, convertArray} from "@/utils/helper/orderHelper";

interface orderComponent {
    item?: any,
    handleClosePopup?: any,
    refreshData?: any
}

interface order {
    id: string,
    name: string,
    amount: number,
    price: number,
    total: number
}


const CreateOrder:React.FC<orderComponent> = ({ item, handleClosePopup, refreshData }) => {
    const router = useRouter();
    const emptyOrder = {
        id: uuidv4(),
        name: "",
        amount: 0,
        price: 0,
        total: 0
    }
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [customer, setCustomer] = useState(item?.customer || "");
    const [date, setDate] = useState<any>(item?.date || new Date());
    const [orders, setOrders] = useState<order[]>(item?.orders || []);
    const [loading, setLoading] = useState("");
    const buttonStyle = "text-white font-bold py-2 px-4 rounded-md"
    const viewStyle = " bg-green-500 hover:bg-green-400"

    useEffect(() => {
        const fetch = async () => {
            try{
                const customersFetch: any = await getData("customers");
                setCustomers(customersFetch);
                const productsFetch: any = await getData("products");
                setProducts(productsFetch);
            }
            catch (e: any) {
                toast.error(e.message);
            }
        }
        fetch();
    }, [])

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
        setDate(date);
    }

    const handleSuccessRequest = (message: string, item?: any) => {
        setTimeout(() => {
            setLoading("");
            if(handleClosePopup){
                refreshData(item);
                handleClosePopup();
            }else {
                router.push('/order');
            }
            toast.success(message);
        }, 3000)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading("create");
        try{
            const newOrder = {
                customer,
                date,
                orders,
                createdAt: new Date(),
                total: calculateTotalPrice(orders),
                status: 'Chờ'
            }
            const orderDB = collection(database, "orders");
            await addDoc(orderDB, newOrder);
            handleSuccessRequest("Tạo hóa đơn thành công");
        }catch (err: any){
            toast.error(err.message);
        }
    }

    const handleUpdate = async (id: string) => {
        setLoading("update");
        try{
            // update document
            const updateOrder = {
                customer,
                date,
                orders,
                total: calculateTotalPrice(orders)
            }
            const orderRef: any = doc(database, "orders", id);
            await setDoc(orderRef, updateOrder);
            // refresh the data
            handleSuccessRequest("Cập nhật hóa đơn thành công", {id, ...updateOrder});
        }catch (err: any){
            toast.error(err.message);
        }
    };

    const performTransaction = async (products: any, transactions: any) => {
        const transaction = runTransaction(database,async (transaction) => {
            try {
                for (const transactionObj of transactions) {
                    const { name, total } = transactionObj;
                    // Get the product document from Firestore with the same name
                    const productRef = collection(database, "products");
                    const queryProduct: any = query(productRef, where("name", "==", name));
                    const productSnapshot = await getDocs(queryProduct);
                    // Check if a matching product document exists
                    if (!productSnapshot.empty) {
                        const productDoc = productSnapshot.docs[0];
                        const productData: any = productDoc.data();

                        // Subtract the total from the product's total
                        const updatedTotal = productData.amount - total;

                        // Throw an error and cancel the transaction if the updated total is negative
                        if (updatedTotal < 0) {
                            throw new Error("Số lượng trong kho không đủ cho sản phẩm " + name);
                        }

                        // Update the product document with the updated total
                        const productUpdate: any = doc(database, "products", productDoc.id);
                        transaction.update(productUpdate, { amount: updatedTotal } as UpdateData<{ amount: number }>);
                    } else {
                        throw new Error("Không tìm thấy sản phẩm: " + name);
                    }
                }
                const updateOrder = {
                    customer,
                    date,
                    orders,
                    total: calculateTotalPrice(orders)
                }
                const orderUpdate: any = doc(database, 'orders', item.id);
                transaction.update(orderUpdate, {
                    status: 'Xong',
                    ...updateOrder
                } as UpdateData<{ status: string, customer: string, date: string, orders: any }>);
                handleSuccessRequest("Chốt đơn thành công", {id: item.id, status: 'Xong', ...updateOrder});
            }catch (err: any) {
                toast.error(err.message);
                handleClosePopup();
            }
        });
        await transaction;
    }

    const handleCompleteOrder = async () => {
        setLoading("complete");
        try{
            const products = await getData("products");
            const ordered = convertArray(orders);
            await performTransaction(products, ordered);
        }catch (err: any) {
            toast.error(err.message);
        }
    }


    return (
        <>
            <form className="mt-5 max-w-xs mx-auto sm:max-w-sm md:max-w-xl" onSubmit={handleSubmit}>
                {/*Customer*/}
                <div className="mb-4">
                    <div className={'font-bold mb-1'}>Customer: </div>
                    <DropDown data={customers} value={item?.customer} index={51} handleChange={handleChangeCustomer} disabled={item && item.status === 'Xong'}/>
                </div>
                {/*Orders*/}
                <div className="mb-4">
                    <div className={'font-bold mb-3'}>Date: </div>
                    <MyDatePicker value={date} handleChangeValue={handleChangeDate} disabled={item && item.status === 'Xong'}/>
                </div>
                <div className="mb-3 font-bold">
                    Order:
                </div>
                <div className="mb-4 flex flex-col justify-between border rounded-xl border-green-300 p-5">
                    {
                        orders.map((order, idx) => (
                            <ProductDetail
                                listProducts={products}
                                key={order.id}
                                index={38 - idx}
                                priority={idx}
                                item={order}
                                handleChangeOrder={handleChangeOrder}
                                deleteOrder={() => deleteOrder(order.id)}
                                isFinished={item && item.status === 'Xong'}
                            />
                        ))
                    }
                    {
                        (item && item?.status === 'Xong')? null: (
                            <div className="flex mt-4">
                                <Button className={buttonStyle + viewStyle} onClick={() => handleButtonClick()}>Thêm</Button>
                            </div>
                        )
                    }
                </div>
                {/*Footer*/}
                <div className="flex items-center">
                    {
                        item ? (
                            <>
                                {
                                    !(item?.status === 'Xong') && (
                                        <>
                                            <button
                                                className="mr-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="button"
                                                onClick={() => handleUpdate(item.id)}
                                            >
                                                {(loading === "update") && <Loading/>}
                                                Sửa
                                            </button>
                                            <button
                                                className="mr-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="button"
                                                onClick={() => handleCompleteOrder()}
                                            >
                                                {(loading === "complete") && <Loading/>}
                                                Chốt
                                            </button>
                                        </>
                                    )
                                }
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={() => handleClosePopup()}
                                >
                                    Đóng
                                </button>
                            </>
                        ): (
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                {(loading === "create") && <Loading/>}
                                Submit
                            </button>
                        )
                    }
                </div>
            </form>
        </>
    )
}

export default CreateOrder;
