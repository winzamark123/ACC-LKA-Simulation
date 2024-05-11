'use client';
import IndexCanvas from '@/components/IndexCanvas';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-500 p-24">
      <div className="flex w-full flex-col items-center justify-center border border-blue-300">
        <IndexCanvas width={600} height={600} />
      </div>
    </main>
  );
}
