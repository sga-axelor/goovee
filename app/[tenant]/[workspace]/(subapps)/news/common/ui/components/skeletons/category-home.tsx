'use client';

// ---- LOCAL IMPORTS ---- //
import {
  FeedListSkeleton,
  LeadStoriesSkeleton,
  NewsCardSkeleton,
  NewsListSkeleton,
} from '@/subapps/news/common/ui/components';

export const CategoryHomeSkeleton = () => {
  return (
    <>
      <LeadStoriesSkeleton />
      <div className="flex flex-col lg:flex-row gap-6">
        <FeedListSkeleton count={5} />
        <NewsListSkeleton width="lg:w-3/5" count={4} />
      </div>
      <NewsCardSkeleton count={5} />
      <NewsListSkeleton width="w-full" count={4} />
    </>
  );
};
