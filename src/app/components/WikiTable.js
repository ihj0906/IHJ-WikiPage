'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const WikiTable = () => {
    // 게시판 목록 저장
    const [data, setData] = useState([]);
    // 현재 페이지
    const [currentPage, setCurrentPage] = useState(1);
    // 목록 개수
    const itemsPerPage = 5;

    useEffect(() => {
        // API로부터 게시판 데이터를 가져오는 비동기 함수
        async function boardResponse() {
            const response = await axios.get('/api/board');
            if (response.status === 200) {
                setData(response.data.data);
            }
        }
        // 컴포넌트가 마운트될 때 한 번 호출
        boardResponse();
    }, []);

    // 현재 페이지의 데이터를 가져오는 함수
    const getPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // 페이지 변경 이벤트 핸들러
    const handlePageChange = newPage => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // 표시되는 페이지 번호를 계산하는 함수
    const visiblePageNumbers = () => {
        const totalVisiblePages = 5;
        const halfVisiblePages = Math.floor(totalVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisiblePages);
        let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);

        if (endPage - startPage < totalVisiblePages - 1) {
            startPage = Math.max(1, endPage - totalVisiblePages + 1);
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
        );
    };

    return (
        <fieldset className="w-1/2 bg-white rounded-md shadow-md overflow-hidden mb-4">
            <table className="w-full table-fixed">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="w-1/4 py-3 px-6 text-left font-bold uppercase">
                            제목
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-100">
                    {getPageData().map(a => (
                        <tr key={a.id}>
                            <td className="py-4 px-6 border-b border-gray-300">
                                <Link
                                    href={`/w/${a.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {a.title}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center items-center bg-gray-100">
                <div className="py-1 px-4">
                    <nav className="flex items-center space-x-1">
                        {/* 첫 페이지로 이동하는 버튼 */}
                        <button
                            className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            <span aria-hidden="true">≪</span>
                            <span className="sr-only">First</span>
                        </button>
                        {/* 이전 페이지로 이동하는 버튼 */}
                        <button
                            type="button"
                            className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <span aria-hidden="true">＜</span>
                            <span className="sr-only">Previous</span>
                        </button>

                        {/* 가운데에 표시되는 페이지 번호들 */}
                        {visiblePageNumbers().map(pageNumber => (
                            <button
                                key={pageNumber}
                                type="button"
                                className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full 
                                        ${
                                            currentPage === pageNumber
                                                ? 'bg-gray-300'
                                                : ''
                                        }`}
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        {/* 다음 페이지로 이동하는 버튼 */}
                        <button
                            type="button"
                            className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <span aria-hidden="true">＞</span>
                        </button>
                        {/* 마지막 페이지로 이동하는 버튼 */}
                        <button
                            className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Last</span>
                            <span aria-hidden="true">≫</span>
                        </button>
                    </nav>
                </div>
            </div>
        </fieldset>
    );
};

export default WikiTable;
