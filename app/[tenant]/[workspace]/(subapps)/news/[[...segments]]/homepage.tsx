import {Suspense} from 'react';

// ---- CORE IMPORTS ----//
import {type Tenant} from '@/tenant';
import {getSession} from '@/auth';
import {PortalWorkspace} from '@/types';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  CategoriesSkeleton,
  Hero,
  NavMenuSkeleton,
  HomeNewsFeedSkeleton,
  LeadStoriesSkeleton,
  HomepageNewsGridSkeleton,
  FeedListSkeleton,
  NewsListSkeleton,
  NewsCardSkeleton,
} from '@/subapps/news/common/ui/components';
import {
  CategorySliderWrapper,
  FeaturedHomePageNewsWrapper,
  HomePageAsideNewsWrapper,
  HomePageFooterNewsWrapper,
  HomePageHeaderNewsWrapper,
  NavMenuWrapper,
} from '@/subapps/news/[[...segments]]/wrappers';
import styles from '@/subapps/news/common/ui/styles/news.module.scss';

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

export async function Homepage({
  workspace,
  tenant,
}: {
  workspace: PortalWorkspace;
  tenant: Tenant['id'];
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

export default Homepage;
