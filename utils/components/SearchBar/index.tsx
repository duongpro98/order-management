import React, {useEffect, useState} from 'react';
import SearchIcon from "@/utils/icon/SearchIcon";
import MyDatePicker from "@/utils/components/DatePicker";
import {convertStartEnd} from "@/utils/helper/orderHelper";
import DropDown from "@/utils/components/DropDown";
import {getData} from "@/services";
import {toast} from "react-toastify";

interface SearchBarProps {
    onSearch: any;
    searching?: boolean;
    onCancelSearch: () => void;
    searchType: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searching, onCancelSearch, searchType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(searchType === "date"){
            onSearch(convertStartEnd(startDate, "start"), convertStartEnd(endDate, "end"), customer);
        }else {
            onSearch(searchTerm);
        }
    };

    const handleChangeStartDate = (date: any) => {
        setStartDate(date);
    }

    const handleChangeEndDate = (date: any) => {
        setEndDate(date);
    }

    const handleChangeCustomer = (value: string) => {
        setCustomer(value);
    }

    useEffect(() => {
        const fetch = async () => {
            try{
                const customersFetch: any = await getData("customers");
                setCustomers(customersFetch);
            }
            catch (e: any) {
                toast.error(e.message);
            }
        }
        fetch();
    }, [])

    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col items-start mb-5 md:flex-row md:items-start">
            {
                searchType === "date"? (
                    <div className="flex flex-col">
                        <div className="flex flex-col items-start md:flex-row md:items-center">
                            <MyDatePicker value={startDate} handleChangeValue={handleChangeStartDate} zIndex={50}/>
                            <div className="mx-2 my-3 md:my-0">Đến</div>
                            <MyDatePicker value={endDate} handleChangeValue={handleChangeEndDate} zIndex={40}/>
                        </div>
                        <div>
                            <DropDown data={customers} placeHolder={"Khách hàng"} value={customer} index={39} handleChange={handleChangeCustomer}/>
                        </div>
                    </div>
                ): (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon/>
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-10 py-2 pl-10 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )
            }
            <div className="flex items-center mt-3 ml-0 md:mt-0 md:ml-2">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
                >
                    Tìm
                </button>
                {
                    searching && (
                        <button
                            type="button"
                            className="ml-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2"
                            onClick={onCancelSearch}
                        >
                            Hủy tìm
                        </button>
                    )
                }
            </div>
        </form>
    );
};

export default SearchBar;