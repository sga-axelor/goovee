import {notFound} from 'next/navigation';
import {Suspense} from 'react';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {DEFAULT_PAGE, SUBAPP_CODES} from '@/constants';
import {type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {t} from '@/locale/server';
import {CommentsSkeleton} from '@/lib/core/comments';

// ---- LOCAL IMPORTS ---- //
import {
  findCategoryTitleBySlugName,
  findNews,
} from '@/subapps/news/common/orm/news';
import {
  CategoriesSkeleton,
  Hero,
  NavMenuSkeleton,
  LeadStoriesSkeleton,
  FeedListSkeleton,
  NewsCardSkeleton,
  NewsInfoSkeleton,
  SocialMediaSkeleton,
  AttachmentListSkeleton,
  BreadcrumbsSkeleton,
  HomeNewsFeedSkeleton,
  CategoryHomeSkeleton,
  ArticleSkeleton,
  HomepageNewsGridSkeleton,
  CategoryNewsGridSkeleton,
  NewsListSkeleton,
} from '@/subapps/news/common/ui/components';
import {
  AttachmentListWrapper,
  CategorySliderWrapper,
  CommentsWrapper,
  CategoryNewsGridLayoutWrapper,
  NavMenuWrapper,
  HomePageFooterNewsWrapper,
  NewsInfoWrapper,
  RecommendedNewsWrapper,
  RelatedNewsWrapper,
  SocialMediaWrapper,
  SubCategorySliderWrapper,
  BreadcrumbsWrapper,
  FeaturedHomePageNewsWrapper,
  HomePageAsideNewsWrapper,
  HomePageHeaderNewsWrapper,
  CategoryPageHeaderNewsWrapper,
} from '@/subapps/news/[[...segments]]/wrappers';
import styles from '@/subapps/news/common/ui/styles/news.module.scss';

export default async function Page({
  params,
  searchParams,
}: {
  params: any;
  searchParams: {[key: string]: string | undefined};
}) {
  const {tenant} = params;

  const session = await getSession();
  const user = session?.user;
  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const {segments} = params;
  const homepage = !segments;

  const {page = DEFAULT_PAGE} = searchParams;

  const isRecommendationEnable =
    workspace.config?.enableRecommendedNews || false;

  const articlePage = segments?.includes('article');

  if (homepage) {
    return (
      <div
        className={`flex flex-col h-full flex-1 ${styles['news-container']}`}>
        <div className="hidden lg:block relative">
          <Suspense fallback={<NavMenuSkeleton />}>
            <NavMenuWrapper workspace={workspace} tenant={tenant} user={user} />
          </Suspense>
        </div>

        <div className="h-full flex flex-col">
          <Hero workspace={workspace} />

          <div className="container mx-auto grid grid-cols-1 gap-6 mb-20 lg:mb-0">
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategorySliderWrapper
                workspace={workspace}
                user={user}
                tenant={tenant}
              />
            </Suspense>
            <Suspense fallback={<HomeNewsFeedSkeleton />}>
              <HomePageNewsFeed
                workspace={workspace}
                user={user}
                tenant={tenant}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full flex-1 ${styles['news-container']}`}>
      <div className="hidden lg:block relative">
        <Suspense fallback={<NavMenuSkeleton />}>
          <NavMenuWrapper workspace={workspace} tenant={tenant} user={user} />
        </Suspense>
      </div>
      <Suspense
        fallback={articlePage ? <ArticleSkeleton /> : <CategoryHomeSkeleton />}>
        <CategoryPage
          segments={segments}
          page={Number(page)}
          workspace={workspace}
          tenantId={tenant}
          workspaceURL={workspaceURL}
          isRecommendationEnable={isRecommendationEnable}
          articlePage={articlePage}
        />
      </Suspense>
    </div>
  );
}

async function CategoryPage({
  segments,
  page,
  workspace,
  tenantId,
  workspaceURL,
  isRecommendationEnable,
  articlePage = false,
}: {
  segments: string[];
  page: number;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  workspaceURL: string;
  isRecommendationEnable: boolean;
  articlePage?: boolean;
}) {
  if (!tenantId) {
    return null;
  }
  const session = await getSession();
  const user = session?.user;

  const slug = segments?.at(-1) || '';

  if (articlePage) {
    const {news}: any = await findNews({
      slug,
      workspace,
      tenantId,
      user,
    }).then(clone);

    const [newsObject] = news;

    if (!newsObject) {
      return notFound();
    }

    return (
      <ArticleFeed
        workspace={workspace}
        segments={segments}
        tenantId={tenantId}
        news={newsObject}
        isRecommendationEnable={isRecommendationEnable}
        workspaceURL={workspaceURL}
        user={user}
      />
    );
  }

  const categoryTitle = await findCategoryTitleBySlugName({
    slug,
    workspace,
    tenantId,
    user,
  });

  if (!categoryTitle) {
    return notFound();
  }

  return (
    <div className="container mx-auto grid grid-cols-1 pb-6 px-4 gap-6 mb-20 lg:mb-0">
      <Suspense fallback={<CategoriesSkeleton />}>
        <SubCategorySliderWrapper
          slug={slug}
          title={categoryTitle}
          workspace={workspace}
          user={user}
          tenant={tenantId}
        />
      </Suspense>
      <Suspense fallback={<CategoryHomeSkeleton />}>
        <CategoryPageFeed
          workspace={workspace}
          tenant={tenantId}
          slug={slug}
          page={page}
          segments={segments}
        />
      </Suspense>
    </div>
  );
}

async function HomePageNewsFeed({
  workspace,
  tenant,
}: {
  workspace: PortalWorkspace;
  user: any;
  tenant: Tenant['id'];
}) {
  return (
    <>
      <Suspense fallback={<LeadStoriesSkeleton />}>
        <HomePageHeaderNewsWrapper
          workspace={workspace}
          tenant={tenant}
          navigatingPathFrom={`${SUBAPP_CODES.news}`}
        />
      </Suspense>

      <Suspense fallback={<HomepageNewsGridSkeleton />}>
        <div className="flex flex-col lg:flex-row gap-6">
          <Suspense fallback={<FeedListSkeleton count={5} />}>
            <FeaturedHomePageNewsWrapper
              workspace={workspace}
              tenant={tenant}
            />
          </Suspense>
          <div className="flex flex-col flex-1 gap-4">
            <Suspense fallback={<NewsListSkeleton width="flex-1" count={4} />}>
              <HomePageAsideNewsWrapper workspace={workspace} tenant={tenant} />
            </Suspense>
          </div>
        </div>
      </Suspense>

      <Suspense fallback={<NewsCardSkeleton count={5} />}>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
          <HomePageFooterNewsWrapper workspace={workspace} tenant={tenant} />
        </div>
      </Suspense>
    </>
  );
}

async function CategoryPageFeed({
  workspace,
  tenant,
  page,
  slug,
  segments,
}: {
  workspace: PortalWorkspace;
  tenant: Tenant['id'];
  page: number;
  slug: string;
  segments?: string[];
}) {
  const navigatingPathFromURL = `${SUBAPP_CODES.news}/${segments?.map((slug: string) => slug).join('/')}`;

  return (
    <>
      <Suspense fallback={<LeadStoriesSkeleton />}>
        <CategoryPageHeaderNewsWrapper
          workspace={workspace}
          tenant={tenant}
          slug={slug}
          navigatingPathFrom={navigatingPathFromURL}
          page={page}
        />
      </Suspense>
      <Suspense fallback={<CategoryNewsGridSkeleton />}>
        <CategoryNewsGridLayoutWrapper
          workspace={workspace}
          tenant={tenant}
          slug={slug}
          navigatingPathFrom={navigatingPathFromURL}
          page={page}
        />
      </Suspense>
    </>
  );
}

async function ArticleFeed({
  workspace,
  segments,
  tenantId,
  news,
  isRecommendationEnable,
  workspaceURL,
  user,
}: {
  workspace: PortalWorkspace;
  segments: string[];
  tenantId: Tenant['id'];
  news: any;
  isRecommendationEnable: boolean;
  workspaceURL: string;
  user: any;
}) {
  const slicedSegments = segments.slice(0, -2);
  const categoryIds = news?.categorySet?.map((item: any) => item.id);

  const segmentPath = slicedSegments?.length
    ? `/${slicedSegments.join('/')}`
    : '';

  const navigatingPathFromURL = `${SUBAPP_CODES.news}${segmentPath}`;
  const directRoute = !slicedSegments?.length;

  return (
    <div className={`container mx-auto grid grid-cols-1 gap-6 mt-6`}>
      {!directRoute && (
        <Suspense fallback={<BreadcrumbsSkeleton />}>
          <div className="py-4">
            <BreadcrumbsWrapper
              workspace={workspace}
              tenantId={tenantId}
              segments={slicedSegments}
              news={news}
              user={user}
            />
          </div>
        </Suspense>
      )}

      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main News Info Section */}
        <div className="lg:col-span-2">
          <Suspense fallback={<NewsInfoSkeleton />}>
            <NewsInfoWrapper news={news} workspace={workspace} />
          </Suspense>
        </div>

        <div className="w-full flex flex-col gap-6">
          {/* SocialMedia Section */}
          <Suspense fallback={<SocialMediaSkeleton />}>
            <SocialMediaWrapper workspace={workspace} />
          </Suspense>

          {/* Attachments Section */}
          <Suspense fallback={<AttachmentListSkeleton />}>
            <AttachmentListWrapper news={news} />
          </Suspense>

          {/* RelatedNews Section */}
          <Suspense fallback={<FeedListSkeleton width="w-full" />}>
            <RelatedNewsWrapper
              news={news}
              navigatingPathFrom={navigatingPathFromURL}
            />
          </Suspense>

          {/* RecommendedNews Section */}
          <Suspense fallback={<FeedListSkeleton width="w-full" />}>
            <RecommendedNewsWrapper
              isRecommendationEnable={isRecommendationEnable}
              navigatingPathFrom={navigatingPathFromURL}
              workspaceURL={workspaceURL}
              tenantId={tenantId}
              categoryIds={categoryIds}
            />
          </Suspense>
        </div>
      </div>

      {/* Comments Section */}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsWrapper
          news={news}
          workspace={workspace}
          user={user}
          workspaceURL={workspaceURL}
        />
      </Suspense>
    </div>
  );
}
