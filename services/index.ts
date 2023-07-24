import {collection, getDocs, limit, orderBy, query, where} from "@firebase/firestore";
import {convertDateOrder, processCustomer} from "@/utils/helper/orderHelper";
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
            const total = await getTotalOrder(doc.data().name);
            const totalSnapshots = total.total;
            const totalRevenue = total.revenue;
            return {
                ...doc.data(),
                id: doc.id,
                totalOrder: totalSnapshots,
                totalRevenue
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

export async function queryOrdersByCustomers(name: string) {
    const getOrdersByCustomers = query(
        collection(database, "orders"),
        where("customer", "==", name),
        where('status', '==', 'Xong')
    );
    const documentSnapshots = await getDocs(getOrdersByCustomers);
    return documentSnapshots
}

export async function getTotalOrder(name: string) {
    const snapshot = await queryOrdersByCustomers(name);
    let revenue = 0;
    snapshot.docs.map((doc: any) => {
        revenue += doc.data().total;
    });
    return {
        total: snapshot.size,
        revenue
    }
}

export async function searchCustomer(name: string) {
    const customers = collection(database, "customers");
    const documentSnapshots = await getDocs(customers);
    const data = documentSnapshots.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    const matchData = data.filter((item: any) => item.name.includes(name));
    return processCustomer(matchData);
}

export async function searchProduct(name: string) {
    const products = collection(database, "products");
    const documentSnapshots = await getDocs(products);
    const data = documentSnapshots.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    const matchData = data.filter((item: any) => item.name.includes(name));
    return convertDateOrder(matchData);
}

export async function searchOrder(start: any, end: any, customer: string) {
    const orderRef = collection(database, "orders");
    const queryOrder = query(
        orderRef,
        where('date', '>=', start),
        where('date', '<=', end),
        where('customer', '==', customer)
    );
    const documentSnapshots = await getDocs(queryOrder);
    const data = documentSnapshots.docs
        .map((doc) => ({...doc.data(), id: doc.id}));
    return convertDateOrder(data);
}

export async function getUser(username: string, password: string) {
    const userRef = collection(database, "users");
    const queryUser = query(userRef, where('name', '==', username));
    const documentSnapshots = await getDocs(queryUser);
    if(documentSnapshots.size > 0){
        const data = documentSnapshots.docs
            .map((doc) => ({...doc.data(), id: doc.id}));
        const user = data[0] as any;
        if(password !== user.password){
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            img: user.img
        };
    }
    return null
}