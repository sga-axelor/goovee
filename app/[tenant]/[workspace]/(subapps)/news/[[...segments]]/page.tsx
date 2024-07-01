import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/subapps/news/common/utils';

// ---- LOCAL IMPORTS ---- //
import Content from '@/subapps/news/[[...segments]]/content';
import {
  findCategories,
  findCategoryTitleBySlugName,
  findNews,
} from '@/subapps/news/common/orm/news';
import {
  Article,
  Categories,
  Homepage,
  // MenuBar,
} from '@/subapps/news/common/ui/components';
import {DEFAULT_LIMIT, ORDER_BY} from '@/subapps/news/common/constants';

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
  const {segments} = params;
  const homepage = !segments;

  const {limit, page} = searchParams;

  const allCategories = await findCategories({
    showAllCategories: true,
  }).then(clone);

  if (homepage) {
    const {news: latestNews} = await findNews({
      orderBy: {publicationDateTime: ORDER_BY.DESC},
    }).then(clone);

    const {news: homePageFeaturedNews} = await findNews({
      isFeaturedNews: true,
    }).then(clone);
    const parentCategories = await findCategories({
      category: null,
    }).then(clone);

    return (
      <div className="flex flex-col h-full">
        <div className="hidden md:block">
          <Categories categories={allCategories} />
        </div>
        <Homepage
          latestNews={latestNews}
          featuredNews={homePageFeaturedNews}
          categories={parentCategories}
        />
        {/* <MenuBar categories={allCategories} /> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="hidden md:block">
        <Categories categories={allCategories} />
      </div>
      <CategoryPage segments={segments} page={page} limit={limit} />
      {/* <MenuBar categories={allCategories} /> */}
    </div>
  );
}

async function CategoryPage({
  segments,
  page,
  limit,
}: {
  segments: string[];
  page?: string;
  limit?: string | number;
}) {
  const slug = segments?.at(-1) || '';
  const articlepage = segments.includes('article');

  if (articlepage) {
    const {news} = await findNews({slug}).then(clone);
    const [newsObject] = news;

    if (!newsObject) {
      return notFound();
    }
    async function getBreadcrumbs() {
      const slicedArray = segments.slice(0, -2);

      const results = slicedArray?.map(async (segment: string) => {
        const categorySegment: CategorySegment = {slug: segment};
        try {
          const categoryTitle =
            await findCategoryTitleBySlugName(categorySegment);
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
  });

  const {news: categoryNews, pageInfo} = await findNews({
    orderBy: {publicationDateTime: ORDER_BY.DESC},
    page,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    category: categoryTitle,
  }).then(clone);

  const {news: categoryFeaturedNews} = await findNews({
    isFeaturedNews: true,
    category: categoryTitle,
  }).then(clone);

  const subCategories = await findCategories({
    slug,
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
