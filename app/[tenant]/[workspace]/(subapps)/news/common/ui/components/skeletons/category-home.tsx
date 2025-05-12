'use client';

// ---- LOCAL IMPORTS ---- //
import {
  CategoriesSkeleton,
  FeedListSkeleton,
  LeadStoriesSkeleton,
  NewsCardSkeleton,
  NewsListSkeleton,
} from '@/subapps/news/common/ui/components';

export const CategoryHomeSkeleton = () => {
  return (
    <div className="container mx-auto grid grid-cols-1 pb-6 px-4 gap-6 mb-20 lg:mb-0">
      <CategoriesSkeleton />
      <LeadStoriesSkeleton />
      <div className="flex flex-col lg:flex-row gap-6">
        <FeedListSkeleton count={5} />
        <NewsListSkeleton width="lg:w-3/5" count={4} />
      </div>
      <NewsCardSkeleton count={5} />
      <NewsListSkeleton width="w-full" count={4} />
    </div>
  );
};
