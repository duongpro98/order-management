import {collection, getDocs, limit, orderBy, query, where} from "@firebase/firestore";
import {convertDateOrder} from "@/utils/helper/orderHelper";
import {database} from "../data/firebase";

export async function getData(collectionName: string){
    const dataRef = collection(database, collectionName);
    const querySnapshot = await getDocs(dataRef);
    const data = querySnapshot.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    return convertDateOrder(data);
}

export async function getCustomersFirstPage() {
    const first = query(collection(database, "customers"), orderBy("name"), limit(3));
    const documentSnapshots = await getDocs(first);
    const data = await Promise.all(documentSnapshots.docs
        .map(async (doc) => {
            const totalSnapshots = await getTotalOrder(doc.data().name);
            return {
                ...doc.data(),
                id: doc.id,
                totalOrder: totalSnapshots
            }
        }));
    return convertDateOrder(data);
}

export async function getProductFirstPage() {
    const first = query(collection(database, "products"), orderBy("name"), limit(3));
    const documentSnapshots = await getDocs(first);
    const data = documentSnapshots.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    return convertDateOrder(data);
}

export async function getOrdersFirstPage() {
    const first = query(collection(database, "orders"), orderBy("date", "desc"), limit(3));
    const documentSnapshots = await getDocs(first);
    const data = documentSnapshots.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    return convertDateOrder(data);
}

export async function getTotalOrder(name: string) {
    const getOrdersByCustomers = query(collection(database, "orders"), where("customer", "==", name));
    const documentSnapshots = await getDocs(getOrdersByCustomers);
    return documentSnapshots.size;
}
