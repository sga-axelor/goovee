'use client';

// ---- LOCAL IMPORTS ---- //
import {
  LeadStoriesSkeleton,
  NewsCardSkeleton,
  FeedListSkeleton,
  NewsListSkeleton,
} from '@/subapps/news/common/ui/components';

export function HomeNewsFeedSkeleton() {
  return (
    <>
      {/* Lead Stories */}
      <LeadStoriesSkeleton />
      {/* Grid Layout (News Items) */}
      <div className="flex flex-col lg:flex-row gap-6">
        <FeedListSkeleton count={5} />
        <div className="lg:w-3/5 flex flex-col gap-4">
          <NewsListSkeleton width="w-full" count={4} />
        </div>
      </div>
      {/* Grid Layout (News Items) */}
      <NewsCardSkeleton count={5} />
    </>
  );
}
