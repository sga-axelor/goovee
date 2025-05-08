import {Suspense} from 'react';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {SUBAPP_CODES} from '@/constants';
import {type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {t} from '@/locale/server';

// ---- LOCAL IMPORTS ---- //
import {
  findCategories,
  findCategoryTitleBySlugName,
  findNews,
  findNewsByCategory,
} from '@/subapps/news/common/orm/news';
import {
  NavMenu,
  CategorySlider,
  LeadStories,
  NewsCard,
  NewsList,
  FeedList,
  NewsInfo,
  SocialMedia,
  AttachmentList,
  FeedListSkeleton,
  NewsListSkeleton,
  NewsCardSkeleton,
  Breadcrumbs,
} from '@/subapps/news/common/ui/components';
import {
  CATEGORIES,
  DEFAULT_NEWS_ASIDE_LIMIT,
  FEATURED_NEWS,
  LATEST_NEWS,
  RECOMMENDED_NEWS,
  RELATED_FILES,
  RELATED_NEWS,
  SUBSCRIBE,
} from '@/subapps/news/common/constants';
import {
  Comments,
  COMMENTS,
  isCommentEnabled,
  SORT_TYPE,
} from '@/lib/core/comments';
import {
  createComment,
  fetchComments,
  findRecommendedNews,
} from '@/subapps/news/common/actions/action';

interface CategorySegment {
  slug: string;
}

export async function CategorySliderWrapper({
  workspace,
  tenant,
  user,
}: {
  workspace: PortalWorkspace;
  user: any;
  tenant: Tenant['id'];
}) {
  const parentCategories = await findCategories({
    category: null,
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  const categorySliderTitle = await t(CATEGORIES);

  return (
    <CategorySlider
      showTitle={Boolean(parentCategories?.length)}
      title={categorySliderTitle}
      categories={parentCategories}
    />
  );
}

export async function NavMenuWrapper({
  workspace,
  tenant,
  user,
}: {
  workspace: PortalWorkspace;
  tenant: Tenant['id'];
  user: any;
}) {
  const allCategories = await findCategories({
    showAllCategories: true,
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  return <NavMenu categories={allCategories} />;
}

export async function LeadStoriesWrapper({
  news,
  navigatingPathFrom,
}: {
  news: any[];
  navigatingPathFrom: string;
}) {
  const title = await t(LATEST_NEWS);
  return (
    <div>
      <LeadStories
        title={title}
        news={news}
        navigatingPathFrom={navigatingPathFrom}
      />
    </div>
  );
}

export async function HomepageNewsGridLayoutWrapper({
  workspace,
  tenant,
  user,
  news,
}: {
  workspace: PortalWorkspace;
  tenant: Tenant['id'];
  user: any;
  news: any[];
}) {
  const {news: featuredNews}: any = await findNews({
    isFeaturedNews: true,
    workspace,
    tenantId: tenant,
    user,
    limit: DEFAULT_NEWS_ASIDE_LIMIT,
  }).then(clone);

  const hasFeaturedNews = featuredNews?.length > 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {hasFeaturedNews && (
        <Suspense fallback={<FeedListSkeleton count={5} />}>
          <FeedList
            title={await t(FEATURED_NEWS)}
            items={featuredNews}
            navigatingPathFrom={`${SUBAPP_CODES.news}`}
          />
        </Suspense>
      )}
      <div
        className={`${hasFeaturedNews ? 'lg:w-3/5' : 'w-full'} flex flex-col gap-4`}>
        <Suspense
          fallback={
            <NewsListSkeleton
              width={hasFeaturedNews ? 'lg:w-3/5' : 'w-full'}
              count={4}
            />
          }>
          <NewsListWrapper news={news} />
        </Suspense>
      </div>
    </div>
  );
}

export async function NewsListWrapper({news}: {news: any[]}) {
  return news
    .slice(3, 7)
    ?.map((news: any) => (
      <NewsList
        key={news.id}
        id={news.id}
        news={news}
        navigatingPathFrom={`${SUBAPP_CODES.news}`}
      />
    ));
}

export async function NewsCardWrapper({news}: {news: any[]}) {
  return news
    .slice(7, 12)
    ?.map((news: any) => (
      <NewsCard
        key={news.id}
        id={news.id}
        news={news}
        navigatingPathFrom={`${SUBAPP_CODES.news}`}
      />
    ));
}

export async function SubCategorySliderWrapper({
  workspace,
  tenant,
  user,
  slug,
  title,
}: {
  workspace: PortalWorkspace;
  user: any;
  tenant: Tenant['id'];
  slug: string;
  title: string;
}) {
  const subCategories = await findCategories({
    slug,
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  const buttonText = await t(SUBSCRIBE);
  return (
    <CategorySlider
      title={title}
      categories={subCategories}
      showButton={false}
      buttonText={buttonText}
      /**
       * TODO: At the moment, we are not using the "Subscribe" button for the categories
       * Later will need to send the button icon from the client component
       */
      // buttonIcon={MdOutlineNotificationAdd}
    />
  );
}

export async function CategoryNewsGridLayoutWrapper({
  workspace,
  tenant,
  user,
  slug,
  navigatingPathFrom,
  news,
  pageInfo,
}: {
  workspace: PortalWorkspace;
  tenant: Tenant['id'];
  user: any;
  slug: string;
  navigatingPathFrom: string;
  news: any;
  pageInfo: any;
}) {
  const {news: featuredNews}: any = await findNewsByCategory({
    isFeaturedNews: true,
    slug,
    workspace,
    tenantId: tenant,
    user,
    limit: DEFAULT_NEWS_ASIDE_LIMIT,
  }).then(clone);

  const hasFeaturedNews = featuredNews?.length > 0;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {hasFeaturedNews && (
          <Suspense fallback={<FeedListSkeleton count={5} />}>
            <FeedList
              title={await t(FEATURED_NEWS)}
              items={featuredNews}
              navigatingPathFrom={navigatingPathFrom}
            />
          </Suspense>
        )}
        <Suspense
          fallback={
            <NewsListSkeleton
              width={hasFeaturedNews ? 'lg:w-3/5' : 'w-full'}
              count={4}
            />
          }>
          <CategoryNewsListWrapper
            news={news}
            start={Number(pageInfo.page) !== 1 ? 0 : 3}
            end={Number(pageInfo.page) !== 1 ? 4 : 7}
            width={hasFeaturedNews ? 'lg:w-3/5' : 'w-full'}
            navigatingPath={navigatingPathFrom}
          />
        </Suspense>
      </div>
      <Suspense fallback={<NewsCardSkeleton count={5} />}>
        <CategoryNewsCardWrapper
          news={news}
          start={Number(pageInfo.page) !== 1 ? 4 : 7}
          end={Number(pageInfo.page) !== 1 ? 9 : 12}
          navigatingPath={navigatingPathFrom}
        />
      </Suspense>
      <Suspense fallback={<NewsListSkeleton width="w-full" count={4} />}>
        <CategoryNewsListWrapper
          news={news}
          start={Number(pageInfo.page) !== 1 ? 9 : 12}
          end={16}
          width="w-full"
          navigatingPath={navigatingPathFrom}
        />
      </Suspense>
    </>
  );
}

const renderNewsItems = ({
  news,
  start,
  end,
  Component,
  navigatingPath,
}: {
  news: any;
  start: number;
  end: number;
  Component: any;
  navigatingPath: string;
}) => {
  return news
    .slice(start, end)
    .map((newsItem: any) => (
      <Component
        key={newsItem.id}
        id={newsItem.id}
        news={newsItem}
        navigatingPathFrom={navigatingPath}
      />
    ));
};

export async function CategoryNewsListWrapper({
  news,
  navigatingPath,
  start,
  end,
  width,
}: {
  news: any;
  navigatingPath: string;
  start: number;
  end: number;
  width?: string;
}) {
  return (
    <ConditionalRender
      items={renderNewsItems({
        news,
        start,
        end,
        Component: NewsList,
        navigatingPath,
      })}
      className={`${width ? width : ''} flex flex-col gap-4`}>
      {renderNewsItems({
        news,
        start,
        end,
        Component: NewsList,
        navigatingPath,
      })}
    </ConditionalRender>
  );
}

export async function CategoryNewsCardWrapper({
  news,
  navigatingPath,
  start,
  end,
}: {
  news: any;
  navigatingPath: string;
  start: number;
  end: number;
}) {
  return (
    <ConditionalRender
      items={renderNewsItems({
        news,
        start,
        end,
        Component: NewsCard,
        navigatingPath,
      })}
      className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
      {renderNewsItems({
        news,
        start,
        end,
        Component: NewsCard,
        navigatingPath,
      })}
    </ConditionalRender>
  );
}

export async function BreadcrumbsWrapper({
  workspace,
  tenantId,
  segments,
  news,
  user,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  segments: string[];
  news: any;
  user: any;
}) {
  async function getBreadcrumbs() {
    const results = segments?.map(async (segment: string, index: number) => {
      const categorySegment: CategorySegment = {slug: segment};

      try {
        const categoryTitle = await findCategoryTitleBySlugName({
          slug: categorySegment,
          workspace,
          tenantId,
          user,
        });
        if (!categoryTitle) {
          return '';
        }
        return {id: index + 1, title: categoryTitle, slug: segment};
      } catch (error) {
        console.error(error);
        return '';
      }
    });

    return await Promise.all(results);
  }

  const breadcrumbs = await getBreadcrumbs();

  return <Breadcrumbs items={breadcrumbs} title={news.title} />;
}

export async function NewsInfoWrapper({news}: {news: any}) {
  const {
    title,
    categorySet,
    image,
    description,
    publicationDateTime,
    content,
    author,
    slug,
  } = news || {};

  return (
    <NewsInfo
      title={title}
      categorySet={categorySet}
      image={image}
      description={description}
      publicationDateTime={publicationDateTime}
      content={content}
      author={author}
      slug={slug}
    />
  );
}

export async function SocialMediaWrapper({
  workspace,
}: {
  workspace: PortalWorkspace;
}) {
  const enableSocialMediaSharing = workspace.config?.enableSocialMediaSharing;
  const availableSocials = workspace.config?.socialMediaSelect;

  /**
   * Temporarly Disabled the rendering of Social Media Icons
   */
  if (true) {
    return;
  }
  if (!enableSocialMediaSharing) {
    return null;
  }

  return <SocialMedia availableSocials={availableSocials} />;
}

export async function AttachmentListWrapper({news}: {news: any}) {
  const {attachmentList = [], slug} = news;

  if (!attachmentList?.length) {
    return null;
  }

  const title = await t(RELATED_FILES);

  return (
    <AttachmentList
      slug={slug}
      title={title}
      items={attachmentList}
      width="w-full"
    />
  );
}

export async function RelatedNewsWrapper({
  news,
  navigatingPathFrom,
}: {
  news: any;
  navigatingPathFrom: string;
}) {
  const {relatedNewsSet = []} = news;
  const title = await t(RELATED_NEWS);

  if (!relatedNewsSet?.length) {
    return null;
  }

  return (
    <FeedList
      title={title}
      items={relatedNewsSet}
      width="w-full"
      navigatingPathFrom={navigatingPathFrom}
    />
  );
}

export async function RecommendedNewsWrapper({
  navigatingPathFrom,
  isRecommendationEnable,
  workspaceURL,
  tenantId,
  categoryIds,
}: {
  navigatingPathFrom: string;
  isRecommendationEnable: boolean;
  workspaceURL: string;
  tenantId: Tenant['id'];
  categoryIds: any;
}) {
  if (!isRecommendationEnable) {
    return;
  }

  const news = await findRecommendedNews({
    workspaceURL,
    tenantId,
    categoryIds,
  });
  const title = await t(RECOMMENDED_NEWS);

  if (!news?.length) {
    return null;
  }

  return (
    <FeedList
      title={title}
      items={news}
      width="w-full"
      navigatingPathFrom={navigatingPathFrom}
    />
  );
}

export async function CommentsWrapper({
  workspace,
  user,
  news,
  workspaceURL,
}: {
  workspace: PortalWorkspace;
  user: any;
  news: any;
  workspaceURL: string;
}) {
  const title = await t(COMMENTS);

  const enableComment = isCommentEnabled({
    subapp: SUBAPP_CODES.news,
    workspace,
  });
  const isDisabled = !user ? true : false;

  if (!enableComment) {
    return null;
  }

  return (
    <div className="w-full mb-24 lg:mb-4">
      <div className="p-4 bg-white flex flex-col gap-4 rounded-lg">
        <div>
          <div className="text-xl font-semibold">{title}</div>
        </div>

        <Comments
          recordId={news.id}
          subapp={SUBAPP_CODES.news}
          disabled={isDisabled}
          inputPosition="bottom"
          sortBy={SORT_TYPE.old}
          showCommentsByDefault
          hideCommentsHeader
          hideSortBy
          hideTopBorder
          hideCloseComments
          showRepliesInMainThread
          trackingField="publicBody"
          commentField="note"
          createComment={createComment}
          fetchComments={fetchComments}
          attachmentDownloadUrl={`${workspaceURL}/${SUBAPP_CODES.news}/api/comments/attachments/${news.id}`}
        />
      </div>
    </div>
  );
}

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
