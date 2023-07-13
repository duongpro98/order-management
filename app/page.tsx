import Customers from "@/components/Customers";
import {getCustomersFirstPage} from "@/services";

export const revalidate = 1

export default async function Home() {
  const data = await getCustomersFirstPage();

  return (
    <>
      <Customers items={data}/>
    </>
  )
}
