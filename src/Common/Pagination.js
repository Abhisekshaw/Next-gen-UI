import React, { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment-timezone';


const Pagination = ({ fields, tableData, itemsPerPage}) => {
    
    //const [tableData, setTableData] = useState([]);

    // pagination starts
    const [currentPage, setCurrentPage] = useState(1);
    const paginationRange = 1;

    const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
    };

    const renderPaginationButtons = () => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    if (totalPages <= 6) {
        return Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
        <li key={i}>
            <button
            className={`px-3 py-1 rounded-md ${currentPage === i
                ? "text-white bg-purple-600 border border-r-0 border-purple-600"
                : "focus:outline-none focus:shadow-outline-purple"
                }`}
            onClick={() => handlePageChange(i)}
            >
            {i}
            </button>
        </li>
        ));
    }

    const pages = [];
    const startPage = Math.max(1, currentPage - paginationRange);
    const endPage = Math.min(totalPages, startPage + 2 * paginationRange);
    if (startPage > 1) {
        pages.push(
        <li key={1}>
            <button
            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={() => handlePageChange(1)}
            >
            1
            </button>
        </li>
        );

        if (startPage > 2) {
        pages.push(<span key="startEllipsis">...</span>);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
        <li key={i}>
            <button
            className={`px-3 py-1 rounded-md ${currentPage === i
                ? "text-white bg-purple-600 border border-r-0 border-purple-600"
                : "focus:outline-none focus:shadow-outline-purple"
                }`}
            onClick={() => handlePageChange(i)}
            >
            {i}
            </button>
        </li>
        );
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
        pages.push(<span key="endEllipsis">...</span>);
        }

        pages.push(
        <li key={totalPages}>
            <button
            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={() => handlePageChange(totalPages)}
            >
            {totalPages}
            </button>
        </li>
        );
    }

    return pages;
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedData = tableData.slice(startIndex, endIndex);
    // pagination ends

    return (
    <div className="col-md-5">
        <table className="table mt-0">
            <thead className="table-dark">
                <tr>
                    {fields.map((field, index) => (
                        <th key={index}>{field.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {currentData.map((item) => (
                    <tr key={item.id}>
                        {fields.map((field, index) => (
                            <td key={index}>{item[field.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        {/* Pagination */}
        <div className="grid px-0 py-0 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
                <ul className="inline-flex items-center">
                <li>
                    <button
                    className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Previous"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    >
                    <svg
                        aria-hidden="true"
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                    >
                        <path
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                        ></path>
                    </svg>
                    </button>
                </li>
                {renderPaginationButtons()}
                <li>
                    <button
                    className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Next"
                    disabled={currentPage === Math.ceil(tableData.length / itemsPerPage)}
                    onClick={() => handlePageChange(currentPage + 1)}
                    >
                    <svg
                        className="w-4 h-4 fill-current"
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                    >
                        <path
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                        ></path>
                    </svg>
                    </button>
                </li>
                </ul>
            </nav>
            </span>
        </div>
    </div>
    );
}

export default Pagination;