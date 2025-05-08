'use client';

// ---- LOCAL IMPORTS ---- //
import {
  FeedListSkeleton,
  NewsListSkeleton,
} from '@/subapps/news/common/ui/components';

export function HomepageNewsGridSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <FeedListSkeleton count={5} />
      <div className="w-full flex flex-col gap-4">
        <NewsListSkeleton width="w-full" />
      </div>
    </div>
  );
}

export default HomepageNewsGridSkeleton;
