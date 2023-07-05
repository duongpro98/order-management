import {getOrders} from "@/services";
import Orders from "@/components/OrdersView";

export const revalidate = 1

export default async function PageOrder() {
    const orders = await getOrders();

    return (
        <>
            <Orders listOrders={orders}/>
        </>
    )
}
