'use client';
import IndexCanvas from '@/components/IndexCanvas';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden bg-slate-500 p-24">
      <div className="flex w-full border border-blue-300">
        <IndexCanvas width={1000} height={800} />
      </div>
    </main>
  );
}
