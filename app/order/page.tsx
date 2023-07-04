import Order from "@/components/Order";
import {getCustomers, getProducts} from "@/services";

export default async function PageOrder() {
    const customers = await getCustomers();
    const products = await getProducts();
    return (
        <>
            <Order listCustomers={customers} listProducts={products}/>
        </>
    )
}
