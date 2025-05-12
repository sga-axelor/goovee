'use client';

// ---- LOCAL IMPORTS ---- //
import {
  FeedListSkeleton,
  NewsCardSkeleton,
  NewsListSkeleton,
} from '@/subapps/news/common/ui/components';

export function CategoryNewsGridSkeleton() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <FeedListSkeleton count={5} />
        <NewsListSkeleton width="w-full" />
      </div>
      <NewsCardSkeleton count={5} />
      <NewsListSkeleton width="w-full" count={4} />
    </>
  );
}
