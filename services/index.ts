import {addDoc, collection, getDocs} from "@firebase/firestore";
import {database} from "../data/firebase";

export async function getCustomers() {
    const customers = collection(database, "customers");
    const querySnapshot = await getDocs(customers);
    const data = querySnapshot.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    return data;
}

export async function getProducts() {
    const products = collection(database, "products");
    const querySnapshot = await getDocs(products);
    const data = querySnapshot.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    return data;
}

export async function addOrders(data: any) {
    try{
        const orders = collection(database, "orders");
        await addDoc(orders, data);
    }catch (err){
        console.log("error ", err)
    }
}