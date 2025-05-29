import {notFound} from 'next/navigation';
import {Suspense} from 'react';

// ---- CORE IMPORTS ----//
import {getSession} from '@/auth';
import {SUBAPP_CODES} from '@/constants';
import {type Tenant} from '@/tenant';
import type {PortalWorkspace} from '@/types';
import {t} from '@/locale/server';

// ---- LOCAL IMPORTS ---- //
import {
  findCategoryTitleBySlugName,
  findNewsCount,
} from '@/subapps/news/common/orm/news';
import {
  CategoriesSkeleton,
  NavMenuSkeleton,
  LeadStoriesSkeleton,
  CategoryHomeSkeleton,
  CategoryNewsGridSkeleton,
} from '@/subapps/news/common/ui/components';
import {
  CategoryNewsGridLayoutWrapper,
  NavMenuWrapper,
  SubCategorySliderWrapper,
  CategoryPageHeaderNewsWrapper,
} from '@/subapps/news/[[...segments]]/wrappers';
import styles from '@/subapps/news/common/ui/styles/news.module.scss';
import {NO_NEWS_AVAILABLE} from '@/subapps/news/common/constants';

async function CategoryGrid({
  segments,
  page,
  workspace,
  tenantId,
  slug = '',
}: {
  segments: string[];
  page: number;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  slug?: string;
}) {
  const session = await getSession();
  const user = session?.user;

  const categoryTitle = await findCategoryTitleBySlugName({
    slug,
    workspace,
    tenantId,
    user,
  });

  const navigatingPathFromURL = `${SUBAPP_CODES.news}/${segments?.map((slug: string) => slug).join('/')}`;

  if (!categoryTitle) {
    return notFound();
  }

  const newsCount = await findNewsCount({workspace, tenantId, user, slug});
  if (!newsCount) {
    return (
      <div className="font-medium text-center flex items-center justify-center py-4 flex-1">
        {await t(NO_NEWS_AVAILABLE)}
      </div>
    );
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
      <Suspense fallback={<LeadStoriesSkeleton />}>
        <CategoryPageHeaderNewsWrapper
          workspace={workspace}
          tenant={tenantId}
          slug={slug}
          navigatingPathFrom={navigatingPathFromURL}
          page={page}
        />
      </Suspense>
      <Suspense fallback={<CategoryNewsGridSkeleton />}>
        <CategoryNewsGridLayoutWrapper
          workspace={workspace}
          tenant={tenantId}
          slug={slug}
          navigatingPathFrom={navigatingPathFromURL}
          page={page}
        />
      </Suspense>
    </div>
  );
}

export async function CategoryNews({
  workspace,
  tenant,
  segments = [],
  page,
  slug,
}: {
  workspace: PortalWorkspace;
  tenant: Tenant['id'];
  segments?: string[];
  page?: number;
  slug: string;
}) {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className={`flex flex-col h-full flex-1 ${styles['news-container']}`}>
      <div className="hidden lg:block relative">
        <Suspense fallback={<NavMenuSkeleton />}>
          <NavMenuWrapper workspace={workspace} tenant={tenant} user={user} />
        </Suspense>
      </div>
      <Suspense fallback={<CategoryHomeSkeleton />}>
        <CategoryGrid
          segments={segments}
          page={Number(page)}
          workspace={workspace}
          tenantId={tenant}
          slug={slug}
        />
      </Suspense>
    </div>
  );
}

export default CategoryNews;
