import Image from 'next/image'
import data from '../data/sample.json';
import Button from "@/utils/components/Button";
import Link from "next/link";
import {database} from "./../data/firebase";
import {collection, getDocs} from "@firebase/firestore";

async function getCustomers() {
  const customers = collection(database, "customers");
  const querySnapshot = await getDocs(customers);
  const newData = querySnapshot.docs
      .map((doc) => ({...doc.data(), id:doc.id }));
  return newData;
}

export const revalidate = 60;

export default async function Home() {
  const buttonStyle = "text-white font-bold py-2 px-4 rounded-2xl"
  const viewStyle = " bg-blue-500 hover:bg-blue-400"
  const deleteStyle = " bg-red-500 hover:bg-red-400"
  const createStyle = " bg-green-500 hover:bg-green-400"
  const datas: any = await getCustomers();
  console.log("data is here", datas)

  return (
    <>
      <div className="flex justify-center p-6">
        <table className="table-auto bg-white">
          <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">{datas[0]?.address}</th>
            <th className="py-2 px-4 border-b text-left">Tên khách hàng</th>
            <th className="py-2 px-4 border-b text-left">Tổng hóa đơn</th>
            <th className="py-2 px-4 border-b text-left">Tổng doanh thu</th>
            <th className="py-2 px-4 border-b text-left">Sđt</th>
            <th className="py-2 px-4 border-b text-left">
              <Link href={"/create"}>
                <Button className={buttonStyle + createStyle}>Tạo</Button>
              </Link>
            </th>
          </tr>
          </thead>
          <tbody>
          {
            data.map((item, idx) => (
                <tr>
                  <td className="py-2 px-4 border-b">{idx + 1}</td>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">0</td>
                  <td className="py-2 px-4 border-b">0</td>
                  <td className="py-2 px-4 border-b">{item.phone}</td>
                  <td className="py-2 px-4 border-b"><Button className={buttonStyle + viewStyle}>Xem</Button></td>
                  <td className="py-2 px-4 border-b"><Button className={buttonStyle + deleteStyle}>Xóa</Button></td>
                </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </>
  )
}
