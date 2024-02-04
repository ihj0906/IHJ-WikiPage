import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'MOCK_DATA.json');

// 게시판 목록의 제목을 클릭 시 상세 페이지 불러오는 api
export async function GET(request, { params }) {
    try {
        const data = JSON.parse(fs.readFileSync(dataFilePath)).find(
            item => item.id === Number(params.id)
        );

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.error(new Error('edit get error'));
    }
}

// 게시판 상세 페이지에서 제목이나 내용을 수정하는 api
export async function POST(request, response) {
    try {
        // 요청으로부터 전송된 데이터 가져오기
        const requestData = await request.json();

        // 기존 데이터 파일 읽기
        const dataFile = JSON.parse(fs.readFileSync(dataFilePath));

        // 요청에서 받은 id와 일치하는 데이터 찾기
        const indexToUpdate = dataFile.findIndex(
            item => item.id === requestData.data.id
        );

        // 해당 id를 가진 데이터가 없으면 에러 응답
        if (indexToUpdate === -1) {
            return NextResponse.error(
                new Error('id 값에 해당하는 데이터가 없습니다.')
            );
        }

        // 해당 id를 가진 데이터 수정
        dataFile[indexToUpdate] = {
            ...dataFile[indexToUpdate],
            ...requestData.data,
        };

        // 수정된 데이터 파일 저장
        fs.writeFileSync(dataFilePath, JSON.stringify(dataFile, null, 2));

        // 수정된 데이터를 응답
        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.error(new Error('edit post error'));
    }
}
