'use client';

import React from 'react';
import {MdOutlineNotificationAdd} from 'react-icons/md';
import {usePathname, useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {useSearchParams} from '@/ui/hooks';
import {Pagination} from '@/ui/components';
import {URL_PARAMS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  CategorySlider,
  FeedList,
  LeadStories,
  NewsCard,
  NewsList,
} from '@/subapps/news/common/ui/components';
import {
  FEATURED_NEWS,
  FINAL_BATCH_START_INDEX,
  MAX_ITEMS_INDEX,
  NO_NEWS_AVAILABLE,
  OTHER_PAGES_END_INDEX,
  OTHER_PAGES_MIDDLE_INDEX,
  OTHER_PAGES_START_INDEX,
  PAGE_1_END_INDEX,
  PAGE_1_MIDDLE_INDEX,
  PAGE_1_START_INDEX,
  SUBSCRIBE,
} from '@/subapps/news/common/constants';

const Content = ({
  category,
  categories,
  news,
  featuredNews,
  pageInfo: {page, pages, hasPrev, hasNext} = {},
}: {
  category?: string;
  categories: any[];
  news: any[];
  featuredNews: any[];
  pageInfo: any;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const {update} = useSearchParams();

  const handlePreviousPage = () => {
    if (!hasPrev) return;
    update([{key: URL_PARAMS.page, value: Math.max(Number(page) - 1, 1)}]);
  };

  const handleNextPage = () => {
    if (!hasNext) return;
    update([{key: URL_PARAMS.page, value: Number(page) + 1}]);
  };

  const handlePage = (page: string | number) => {
    update([{key: URL_PARAMS.page, value: page}]);
  };

  const handleClick = (slug: string) => {
    router.push(`${pathname}/article/${slug}`);
  };

  const renderNewsItems = (start: number, end: number, Component: any) => {
    return news
      .slice(start, end)
      .map(newsItem => (
        <Component
          key={newsItem.id}
          id={newsItem.id}
          news={newsItem}
          onClick={handleClick}
        />
      ));
  };

  return (
    <>
      <div
        className={`container mx-auto grid grid-cols-1 pb-6 px-4 gap-6 mb-20 lg:mb-0`}>
        {news?.length > 0 ? (
          <>
            <CategorySlider
              title={category}
              categories={categories}
              showButton={true}
              buttonText={i18n.get(SUBSCRIBE)}
              buttonIcon={MdOutlineNotificationAdd}
            />
            {Number(page) === 1 && (
              <LeadStories news={news} onClick={handleClick} />
            )}
            <div className="flex flex-col lg:flex-row gap-6">
              {featuredNews?.length > 0 && (
                <FeedList
                  title={i18n.get(FEATURED_NEWS)}
                  items={featuredNews}
                  onClick={handleClick}
                />
              )}
              <ConditionalRender
                items={renderNewsItems(
                  Number(page) !== 1
                    ? OTHER_PAGES_START_INDEX
                    : PAGE_1_START_INDEX,
                  Number(page) !== 1
                    ? OTHER_PAGES_MIDDLE_INDEX
                    : PAGE_1_MIDDLE_INDEX,
                  NewsList,
                )}
                className={`${
                  featuredNews?.length ? 'lg:w-3/5' : 'w-full'
                } flex flex-col gap-4`}>
                {renderNewsItems(
                  Number(page) !== 1
                    ? OTHER_PAGES_START_INDEX
                    : PAGE_1_START_INDEX,
                  Number(page) !== 1
                    ? OTHER_PAGES_MIDDLE_INDEX
                    : PAGE_1_MIDDLE_INDEX,
                  NewsList,
                )}
              </ConditionalRender>
            </div>
            <ConditionalRender
              items={renderNewsItems(
                Number(page) !== 1
                  ? OTHER_PAGES_MIDDLE_INDEX
                  : PAGE_1_END_INDEX,
                Number(page) !== 1
                  ? OTHER_PAGES_END_INDEX
                  : FINAL_BATCH_START_INDEX,
                NewsCard,
              )}
              className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
              {renderNewsItems(
                Number(page) !== 1
                  ? OTHER_PAGES_MIDDLE_INDEX
                  : PAGE_1_END_INDEX,
                Number(page) !== 1
                  ? OTHER_PAGES_END_INDEX
                  : FINAL_BATCH_START_INDEX,
                NewsCard,
              )}
            </ConditionalRender>
            <ConditionalRender
              items={renderNewsItems(
                Number(page) !== 1
                  ? OTHER_PAGES_END_INDEX
                  : FINAL_BATCH_START_INDEX,
                MAX_ITEMS_INDEX,
                NewsList,
              )}
              className="flex flex-wrap gap-6">
              {renderNewsItems(
                Number(page) !== 1
                  ? OTHER_PAGES_END_INDEX
                  : FINAL_BATCH_START_INDEX,
                MAX_ITEMS_INDEX,
                NewsList,
              )}
            </ConditionalRender>
            <div className="mb-12 md:mb-0">
              <Pagination
                page={page}
                pages={pages}
                disablePrev={!hasPrev}
                disableNext={!hasNext}
                onPrev={handlePreviousPage}
                onNext={handleNextPage}
                onPage={handlePage}
              />
            </div>
          </>
        ) : (
          <>
            <div className="font-medium text-center flex items-center justify-center h-full py-4">
              {i18n.get(NO_NEWS_AVAILABLE)}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Content;

// ---- HELPER COMPONENT ---- //
const ConditionalRender = ({
  children,
  items,
  className,
}: {
  children: React.ReactNode;
  items: any[];
  className?: string;
}) => {
  if (!items || items.length === 0) return null;
  return <div className={className}>{children}</div>;
};
