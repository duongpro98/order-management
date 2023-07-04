import Customers from "@/components/Customers";
import {getCustomers} from "@/services";

export default async function Home() {
  const data = await getCustomers();
  return (
    <>
      <Customers items={data}/>
    </>
  )
}
