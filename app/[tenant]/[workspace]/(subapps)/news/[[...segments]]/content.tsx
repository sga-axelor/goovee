'use client';

import React from 'react';
import {MdOutlineNotificationAdd} from 'react-icons/md';
import {usePathname, useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';
import {Pagination} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {
  CategorySlider,
  FeedList,
  LeadStories,
  NewsCard,
  NewsList,
} from '@/subapps/news/common/ui/components';
import styles from '@/subapps/news/common/ui/styles/news.module.scss';
import {
  FEATURED_NEWS,
  NO_NEWS_AVAILABLE,
  SUBSCRIBE,
  URL_PARAMS,
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
        className={`${styles['news-container']} flex-auto py-6 px-4 lg:px-[100px] flex flex-col gap-6`}>
        {news.length > 0 ? (
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
              {featuredNews.length > 0 && (
                <FeedList
                  title={i18n.get(FEATURED_NEWS)}
                  items={featuredNews}
                  onClick={handleClick}
                />
              )}
              <div
                className={`${
                  featuredNews.length ? 'lg:w-3/5' : 'w-full'
                } flex flex-col gap-4`}>
                {renderNewsItems(
                  Number(page) !== 1 ? 0 : 3,
                  Number(page) !== 1 ? 4 : 7,
                  NewsList,
                )}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
              {renderNewsItems(
                Number(page) !== 1 ? 4 : 7,
                Number(page) !== 1 ? 9 : 12,
                NewsCard,
              )}
            </div>
            <div className="flex flex-wrap gap-6">
              {renderNewsItems(Number(page) !== 1 ? 9 : 12, 16, NewsList)}
            </div>
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
