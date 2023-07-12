import {getOrdersFirstPage} from "@/services";
import {convertDateOrder} from "@/utils/helper/orderHelper";
import Orders from "@/components/OrdersView";

export const revalidate = 1

export default async function PageOrder() {
    const orders = await getOrdersFirstPage();

    return (
        <>
            <Orders listOrders={convertDateOrder(orders)}/>
        </>
    )
}
