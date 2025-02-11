import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {ORDER_BY} from '@/constants';
import {type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/news/[[...segments]]/content';
import {
  findCategories,
  findCategoryTitleBySlugName,
  findNews,
  findNewsByCategory,
} from '@/subapps/news/common/orm/news';
import {
  Article,
  Categories,
  Homepage,
} from '@/subapps/news/common/ui/components';
import {
  DEFAULT_LIMIT,
  DEFAULT_NEWS_ASIDE_LIMIT,
} from '@/subapps/news/common/constants';
import {findRecommendedNews} from '@/subapps/news/common/actions/action';
import styles from '@/subapps/news/common/ui/styles/news.module.scss';

interface CategorySegment {
  slug: string;
}

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

  const {limit, page} = searchParams;

  const allCategories = await findCategories({
    showAllCategories: true,
    workspace,
    tenantId: tenant,
  }).then(clone);

  const isRecommendationEnable =
    workspace.config?.enableRecommendedNews || false;

  if (homepage) {
    const {news: latestNews}: any = await findNews({
      orderBy: {publicationDateTime: ORDER_BY.DESC},
      workspace,
      tenantId: tenant,
      user,
    }).then(clone);

    const {news: homePageFeaturedNews}: any = await findNews({
      isFeaturedNews: true,
      workspace,
      tenantId: tenant,
      user,
      limit: DEFAULT_NEWS_ASIDE_LIMIT,
    }).then(clone);

    const parentCategories = await findCategories({
      category: null,
      workspace,
      tenantId: tenant,
      user,
    }).then(clone);

    return (
      <div
        className={`flex flex-col h-full flex-1 ${styles['news-container']}`}>
        <div className="hidden lg:block relative">
          <Categories categories={allCategories} />
        </div>
        <Homepage
          latestNews={latestNews}
          featuredNews={homePageFeaturedNews}
          categories={parentCategories}
          workspace={workspace}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full flex-1 ${styles['news-container']}`}>
      <div className="hidden lg:block relative">
        <Categories categories={allCategories} />
      </div>
      <CategoryPage
        segments={segments}
        page={page}
        limit={limit}
        workspace={workspace}
        tenantId={tenant}
        isRecommendationEnable={isRecommendationEnable}
      />
    </div>
  );
}

async function CategoryPage({
  segments,
  page,
  limit,
  workspace,
  tenantId,
  isRecommendationEnable,
}: {
  segments: string[];
  page?: string;
  limit?: string | number;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  isRecommendationEnable: boolean;
}) {
  if (!tenantId) {
    return null;
  }

  const session = await getSession();
  const user = session?.user;

  const slug = segments?.at(-1) || '';
  const articlepage = segments.includes('article');

  if (articlepage) {
    const {news}: any = await findNews({
      slug,
      workspace,
      tenantId,
      user,
    }).then(clone);

    const [newsObject] = news;

    const categoryIds = newsObject?.categorySet?.map((item: any) => item.id);
    let recommendedNews = [];
    if (isRecommendationEnable) {
      recommendedNews = await findRecommendedNews({
        workspace,
        tenantId,
        categoryIds,
      });
    }

    if (!newsObject) {
      return notFound();
    }
    async function getBreadcrumbs() {
      const slicedArray = segments.slice(0, -2);

      const results = slicedArray?.map(async (segment: string) => {
        const categorySegment: CategorySegment = {slug: segment};

        try {
          const categoryTitle = await findCategoryTitleBySlugName({
            slug: categorySegment,
            workspace,
            tenantId,
          });
          if (!categoryTitle) {
            return notFound();
          }
          return {title: categoryTitle, slug: segment};
        } catch (error) {
          console.error(error);
          return '';
        }
      });

      return await Promise.all(results);
    }
    const breadcrumbs = await getBreadcrumbs();

    return (
      <Article
        news={{...newsObject, recommendedNews}}
        breadcrumbs={breadcrumbs}
        workspace={workspace}
      />
    );
  }

  const categoryTitle = await findCategoryTitleBySlugName({
    slug,
    workspace,
    tenantId,
  });

  if (!categoryTitle) {
    return notFound();
  }

  const {news: categoryNews, pageInfo}: any = await findNewsByCategory({
    orderBy: {publicationDateTime: ORDER_BY.DESC},
    page,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    slug,
    workspace,
    tenantId,
    user,
  }).then(clone);

  const {news: categoryFeaturedNews}: any = await findNewsByCategory({
    isFeaturedNews: true,
    slug,
    workspace,
    tenantId,
    user,
  }).then(clone);

  const subCategories = await findCategories({
    slug,
    workspace,
    tenantId,
    user,
  }).then(clone);

  return (
    <>
      <Content
        category={categoryTitle}
        categories={subCategories}
        news={categoryNews}
        featuredNews={categoryFeaturedNews}
        pageInfo={pageInfo}
      />
    </>
  );
}
