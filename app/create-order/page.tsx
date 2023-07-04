import CreateOrder from "@/components/Order";
import {getCustomers, getProducts} from "@/services";

export default async function PageCreateOrder() {
    const customers = await getCustomers();
    const products = await getProducts();
    return (
        <>
            <CreateOrder listCustomers={customers} listProducts={products}/>
        </>
    )
}
