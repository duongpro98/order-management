import Customers from "@/components/Customers";
import {getCustomers} from "@/services";
import {useContext} from "react";
import {MyContext} from "@/app/AppContext";

export const revalidate = 1

export default async function Home() {
  const data = await getCustomers();
  return (
    <>
      <Customers items={data}/>
    </>
  )
}
