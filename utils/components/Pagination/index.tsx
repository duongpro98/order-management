import React from 'react';

interface paginationObj {
    currentPage: number,
    totalPages: number,
    handlePreviousPage: any,
    handleNextPage: any
}

const Pagination: React.FC<paginationObj> = ({ currentPage, totalPages, handleNextPage, handlePreviousPage }) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                Previous Page
            </button>
            <div className="mx-5">
                <span>{currentPage}</span> / <span>{totalPages}</span>
            </div>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                Next Page
            </button>
        </div>
    );
};

export default Pagination;