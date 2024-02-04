'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function DetailPage(props) {
    const [data, setData] = useState('');
    const [tableData, setTableData] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // 마운트 시 현재 페이지로 이동시 전달받은 query params의 id값을 이용해 상세 목록 불러오기
        async function pageResponse() {
            const response = await axios.get(`/api/edit/${props.params.id}`);
            if (response.status === 200) {
                setData(response.data.data);
            }
        }
        // 다른 게시물의 제목과 같은 본문 내용을 확인하기 위해 전체목록 불러오기
        async function boardResponse() {
            const response = await axios.get('/api/board');
            if (response.status === 200) {
                setTableData(response.data.data);
            }
        }
        pageResponse();
        boardResponse();
    }, [props.params.id]);

    // 게시판 목록에서 링크를 생성하는 함수
    const createLinkForBoard = boardTitle => {
        const board = tableData.find(item => item.title === boardTitle);
        // 본문의 내용 중 다른 게시물의 제목과 일치한게 있다면 Link연결 해 return 없다면 본문 그대로 return
        if (board) {
            return (
                <Link
                    className="text-blue-700"
                    key={board.id}
                    href={`/w/${board.id}`}
                >
                    {board.title}
                </Link>
            );
        } else {
            return boardTitle;
        }
    };

    // 수정 버튼 기능
    const handleEditModeClick = () => {
        if (editMode) {
            // 수정 모드일 경우 해당 함수 실행
            handleEditClick();
        } else {
            // 수정 모드가 아닐 경우 수정 모드로 전환
            setEditMode(!editMode);
        }
    };

    // 취소 버튼 기능
    const handleCancelClick = () => {
        if (editMode) {
            // 수정 모드일 경우 취소 버튼 클릭 시 수정 모드 비활성화
            setEditMode(!editMode);
        } else {
            // 수정 모드가 아닐 경우 메인 화면으로 이동
            router.push('/');
        }
    };

    // 수정 기능
    const handleEditClick = async () => {
        // 수정 버튼 클릭 시 confirm 팝업을 통해 확인
        // 취소 시 아무 동작 하지 않음
        if (window.confirm('수정 하시겠습니까?')) {
            try {
                // axios를 사용하여 API Route로 POST 요청을 보냄
                const response = await axios.post(
                    `/api/edit/${props.params.id}`,
                    {
                        data,
                    }
                );
                if (response.status === 200) {
                    // 수정 저장 완료 후 수정 모드 비활성화
                    alert('수정 완료');
                    setEditMode(false);
                } else {
                    alert('수정 실패 ', responseStatus);
                    setEditMode(false);
                }
            } catch (error) {
                console.error('Error : ', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form className="max-w-3xl w-2/3 mx-auto p-8 bg-white shadow-md rounded-md">
                <h2 className="text-3xl font-bold mb-4 text-blue-500">
                    위키 페이지
                </h2>
                <div className="mb-6">
                    <label
                        className="block text-sm font-medium text-gray-600 mb-1"
                        htmlFor="name"
                    >
                        제목
                    </label>
                    {/* 수정 모드 일 경우 input 태그 수정모드가 아닐 경우 div 태그 사용 */}
                    {editMode ? (
                        <input
                            className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            id="name"
                            value={data.title}
                            onChange={e =>
                                setData(() => ({
                                    title: e.target.value,
                                }))
                            }
                        />
                    ) : (
                        <div className="text-lg font-medium text-gray-800">
                            {data.title}
                        </div>
                    )}
                </div>
                <div className="mb-10">
                    <label
                        className="block text-sm font-medium text-gray-600 mb-1"
                        htmlFor="message"
                    >
                        내용
                    </label>
                    {/* 수정 모드 일 경우 textarea 태그 수정모드가 아닐 경우 div 태그 사용 */}
                    {editMode ? (
                        <textarea
                            className="w-full h-40 py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="message"
                            value={data.contents}
                            onChange={e =>
                                setData(prevData => ({
                                    ...prevData,
                                    contents: e.target.value,
                                }))
                            }
                        />
                    ) : (
                        <div className="w-full h-40 text-gray-800">
                            {/* 본문을 공백으로 나누어 다른 게시물의 제목과 일치하는 내용이 있다면 해당 게시물로 이동할 수 있는 링크 추가 */}
                            {(data.contents || '')
                                .split(' ')
                                .map((word, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && ' '} {/* 공백 추가 */}
                                        {createLinkForBoard(word)}
                                    </React.Fragment>
                                ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-between">
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="button"
                        onClick={handleEditModeClick}
                    >
                        {/* 수정 모드 일 경우 저장, 아닐 경우 수정 으로 텍스트 변경 */}
                        {editMode ? '저장' : '수정'}
                    </button>
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="button"
                        onClick={handleCancelClick}
                    >
                        {/* 수정 모드 일 경우 취소, 아닐 경우 뒤로가기 로 텍스트 변경 */}
                        {editMode ? '취소' : '뒤로가기'}
                    </button>
                </div>
            </form>
        </div>
    );
}
