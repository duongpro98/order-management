import React, { useState } from 'react';
import SearchIcon from "@/utils/icon/SearchIcon";
import MyDatePicker from "@/utils/components/DatePicker";
import {convertStartEnd} from "@/utils/helper/orderHelper";

interface SearchBarProps {
    onSearch: any;
    searching?: boolean;
    onCancelSearch: () => void;
    searchType: string
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searching, onCancelSearch, searchType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(searchType === "date"){
            onSearch(convertStartEnd(startDate, "start"), convertStartEnd(endDate, "end"));
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

    return (
        <form onSubmit={handleFormSubmit} className="flex items-center mb-5">
            {
                searchType === "date"? (
                    <>
                        <MyDatePicker value={startDate} handleChangeValue={handleChangeStartDate}/>
                        <div className="mx-5">Đến</div>
                        <MyDatePicker value={endDate} handleChangeValue={handleChangeEndDate}/>
                    </>
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
            <button
                type="submit"
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
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
        </form>
    );
};

export default SearchBar;