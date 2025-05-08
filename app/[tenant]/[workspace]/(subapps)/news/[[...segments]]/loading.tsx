import {Skeleton} from '@/ui/components';

export default function Loading() {
  return (
    <div className={`grid grid-cols-1 p-4  h-full`}>
      <Skeleton className="flex items-center justify-center !border-0">
        <div className="w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full animate-spin-fast" />
      </Skeleton>
    </div>
  );
}
