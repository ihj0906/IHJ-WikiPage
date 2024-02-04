import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'MOCK_DATA.json');

// 게시판 목록을 불러오는 api
export async function GET() {
    try {
        const data = JSON.parse(fs.readFileSync(dataFilePath));

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.error(new Error('board get error'));
    }
}
