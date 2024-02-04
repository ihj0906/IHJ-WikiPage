import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'MOCK_DATA.json');

// 새 위키 페이지를 등록하는 api
export async function POST(request, response) {
    try {
        const dataFile = JSON.parse(fs.readFileSync(dataFilePath));
        const data = await request.json();
        // dataFile의 목록에 저장된 목록이 있을 경우 dataFile 마지막 배열에 해당하는 id값에 1증가하여 id값 저장
        // 저장된 목록이 없을 경우 id값 1
        const newId =
            dataFile.length > 0 ? dataFile[dataFile.length - 1].id + 1 : 1;
        const newPage = {
            id: newId,
            title: data.title,
            contents: data.content,
        };

        // 수정된 데이터 파일에 추가
        dataFile.push(newPage);

        // 수정된 데이터 파일 저장
        fs.writeFileSync(dataFilePath, JSON.stringify(dataFile, null, 2));

        // 수정된 데이터를 응답
        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.error('new post error');
    }
}
