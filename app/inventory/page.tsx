import {getProductFirstPage} from "@/services";
import Products from "@/components/Products";

export const revalidate = 1

export default async function PageInventory() {
    const products = await getProductFirstPage();

    return (
        <>
            <Products items={products}/>
        </>
    )
}
