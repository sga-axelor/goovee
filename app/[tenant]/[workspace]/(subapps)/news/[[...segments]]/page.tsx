import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {ID, PortalWorkspace} from '@/types';
import {ORDER_BY} from '@/constants';

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
import {DEFAULT_LIMIT} from '@/subapps/news/common/constants';

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
  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const {segments} = params;
  const homepage = !segments;

  const {limit, page} = searchParams;

  const allCategories = await findCategories({
    showAllCategories: true,
    workspace,
    tenantId: tenant,
  }).then(clone);
  if (homepage) {
    const {news: latestNews} = await findNews({
      orderBy: {publicationDateTime: ORDER_BY.DESC},
      workspace,
      tenantId: tenant,
    }).then(clone);

    const {news: homePageFeaturedNews} = await findNews({
      isFeaturedNews: true,
      workspace,
      tenantId: tenant,
    }).then(clone);

    const parentCategories = await findCategories({
      category: null,
      workspace,
      tenantId: tenant,
    }).then(clone);

    return (
      <div className="flex flex-col h-full flex-1">
        <div className="hidden lg:block">
          <Categories categories={allCategories} />
        </div>
        <Homepage
          latestNews={latestNews}
          featuredNews={homePageFeaturedNews}
          categories={parentCategories}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="hidden lg:block">
        <Categories categories={allCategories} />
      </div>
      <CategoryPage
        segments={segments}
        page={page}
        limit={limit}
        workspace={workspace}
        tenantId={tenant}
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
}: {
  segments: string[];
  page?: string;
  limit?: string | number;
  workspace: PortalWorkspace;
  tenantId: ID;
}) {
  if (!tenantId) {
    return null;
  }

  const slug = segments?.at(-1) || '';
  const articlepage = segments.includes('article');

  if (articlepage) {
    const {news} = await findNews({slug, workspace, tenantId}).then(clone);
    const [newsObject] = news;

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

    return <Article news={newsObject} breadcrumbs={breadcrumbs} />;
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
  }).then(clone);

  const {news: categoryFeaturedNews} = await findNewsByCategory({
    isFeaturedNews: true,
    slug,
    workspace,
    tenantId,
  }).then(clone);

  const subCategories = await findCategories({
    slug,
    workspace,
    tenantId,
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
