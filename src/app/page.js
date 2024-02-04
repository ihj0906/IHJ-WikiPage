import Link from 'next/link';
import WikiTable from './components/WikiTable';

export default function Home() {
    return (
        <main className="mx-auto flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-t from-blue-500 to-blue-100">
            <WikiTable />
            <button className="py-2.5 px-6 rounded-lg text-sm font-medium bg-white text-blue-500 hover:bg-blue-400">
                <Link href="/w/new">추가</Link>
            </button>
        </main>
    );
}
