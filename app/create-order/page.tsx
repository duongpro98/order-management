import CreateOrder from "@/components/Order";
import {getCustomers, getProducts} from "@/services";

export const revalidate = 1

export default async function PageCreateOrder() {
    const customers = await getCustomers();
    const products = await getProducts();
    return (
        <>
            <CreateOrder listCustomers={customers} listProducts={products}/>
        </>
    )
}
