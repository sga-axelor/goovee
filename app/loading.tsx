'use client';

export default function Loading() {
  return (
    <div className="grid grid-cols-1 p-4 h-screen container">
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-t-transparent border-success rounded-full animate-spin-fast" />
      </div>
    </div>
  );
}
