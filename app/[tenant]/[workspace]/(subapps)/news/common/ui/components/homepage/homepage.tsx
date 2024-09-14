'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {BANNER_DESCRIPTION, BANNER_TITLES, IMAGE_URL} from '@/constants';
import {HeroSearch, Search} from '@/ui/components';
import {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  LeadStories,
  CategorySlider,
  NewsList,
  NewsCard,
  FeedList,
  SearchItem,
} from '@/subapps/news/common/ui/components';
import {
  CATEGORIES,
  FEATURED_NEWS,
  LATEST_NEWS,
  NO_NEWS_AVAILABLE,
} from '@/subapps/news/common/constants';
import styles from '@/subapps/news/common/ui/styles/news.module.scss';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {findSearchNews} from '@/subapps/news/common/actions/action';

export const Homepage = ({
  latestNews,
  featuredNews,
  categories,
}: {
  latestNews: any;
  featuredNews: any;
  categories: any;
}) => {
  const router = useRouter();
  const {workspaceURI, workspaceURL} = useWorkspace();

  const handleClick = (slug: string) => {
    router.push(`${workspaceURI}/news/article/${slug}`);
  };

  const renderSearch = () => (
    <Search
      searchKey="title"
      findQuery={() => findSearchNews({workspaceURL})}
      renderItem={SearchItem}
      onItemClick={handleClick}
    />
  );

  return (
    <div className="h-full flex flex-col">
      <HeroSearch
        title={BANNER_TITLES.news}
        description={BANNER_DESCRIPTION}
        image={IMAGE_URL}
        renderSearch={renderSearch}
      />
      <div
        className={`px-4 lg:px-[100px] flex flex-col gap-6 flex-auto ${styles['news-container']}`}>
        {latestNews?.length ? (
          <>
            <div className="mt-6">
              <LeadStories
                title={i18n.get(LATEST_NEWS)}
                news={latestNews}
                onClick={handleClick}
              />
            </div>
            <CategorySlider
              showTitle={categories.length}
              title={i18n.get(CATEGORIES)}
              categories={categories}
            />
            <div className="flex flex-col lg:flex-row gap-6">
              {featuredNews?.length > 0 ? (
                <FeedList
                  title={i18n.get(FEATURED_NEWS)}
                  items={featuredNews}
                  onClick={handleClick}
                />
              ) : (
                <></>
              )}
              <div className="lg:w-3/5 flex flex-col gap-4">
                {latestNews.slice(3, 7).map((news: any) => (
                  <NewsList
                    key={news.id}
                    id={news.id}
                    news={news}
                    onClick={handleClick}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5 mb-10">
              {latestNews.slice(7, 12).map((news: any) => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  news={news}
                  onClick={handleClick}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="font-medium text-center flex items-center justify-center py-4 flex-1">
            {i18n.get(NO_NEWS_AVAILABLE)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
