'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function NewPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const router = useRouter();

    const handleSubmitClick = async () => {
        if (window.confirm('등록 하시겠습니까?')) {
            try {
                // axios를 사용하여 API Route로 POST 요청을 보냄
                const response = await axios.post('/api/new', {
                    title,
                    content,
                });
                if (response.status === 200) {
                    alert('등록 완료');
                    router.push('/');
                } else {
                    alert('실패 ', responseStatus);
                }
            } catch (error) {
                console.error('Error : ', error);
            }
        }
    };

    const handleCancelClick = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form className="max-w-3xl w-2/3 mx-auto p-8 bg-white shadow-md rounded-md">
                <h2 className="text-3xl font-bold mb-4 text-blue-500">
                    새 위키 페이지
                </h2>
                <div className="mb-6">
                    <label
                        className="block text-sm font-medium text-gray-600 mb-1"
                        htmlFor="name"
                    >
                        제목
                    </label>
                    <input
                        className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        id="name"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-10">
                    <label
                        className="block text-sm font-medium text-gray-600 mb-1"
                        htmlFor="message"
                    >
                        내용
                    </label>
                    <textarea
                        className="w-full h-40 py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="message"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex justify-between">
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="button"
                        onClick={handleSubmitClick}
                    >
                        등록
                    </button>
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="button"
                        onClick={handleCancelClick}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
