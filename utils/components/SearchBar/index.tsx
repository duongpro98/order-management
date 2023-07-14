import React, { useState } from 'react';
import SearchIcon from "@/utils/icon/SearchIcon";

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
    searching?: boolean;
    onCancelSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searching, onCancelSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleFormSubmit} className="flex items-center mb-5">
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