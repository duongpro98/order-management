import {getProducts} from "@/services";
import Products from "@/components/Products";

export const revalidate = 1

export default async function PageInventory() {
    const products = await getProducts();

    return (
        <>
            <Products items={products}/>
        </>
    )
}
