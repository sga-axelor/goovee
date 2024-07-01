// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';

// ---- LOCAL IMPORTS ---- //
import {DEFAULT_PAGE} from '@/subapps/news/common/constants';
import {getPageInfo, getSkipInfo} from '@/subapps/news/common/utils';

export async function findNews({
  id = '',
  orderBy,
  isFeaturedNews = false,
  category,
  page = DEFAULT_PAGE,
  limit,
  slug,
}: {
  id?: string | number;
  orderBy?: any;
  isFeaturedNews?: boolean;
  category?: string;
  page?: string | number;
  limit?: number;
  slug?: string;
}) {
  const c = await getClient();

  const skip = getSkipInfo(limit, page);

  const whereClause = {
    ...(id
      ? {
          id,
        }
      : {}),
    ...(isFeaturedNews ? {isFeaturedNews: true} : {}),
    ...(category
      ? {
          categorySet: {
            name: {like: `%${category}%`},
          },
        }
      : {}),
    ...(slug ? {slug} : {}),
  };

  const news = await c.aOSPortalNews
    .find({
      where: whereClause,
      ...(orderBy ? {orderBy} : {}),
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        title: true,
        publicationDateTime: true,
        description: true,
        image: {id: true},
        categorySet: {
          select: {
            name: true,
            parentCategory: {
              name: true,
              parentCategory: true,
            },
          },
        },
        content: true,
        author: {
          simpleFullName: true,
          picture: true,
        },
        relatedNewsSet: {
          select: {
            title: true,
            id: true,
            image: {id: true},
            categorySet: true,
            publicationDateTime: true,
            slug: true,
          },
        },
        slug: true,
        portalCommentList: {
          select: {
            contentComment: true,
            author: {
              simpleFullName: true,
              picture: true,
            },
            publicationDateTime: true,
          },
        },
      },
    })
    .catch(() => []);

  const pageInfo = getPageInfo({
    count: news?.[0]?._count,
    page,
    limit,
  });
  return {news, pageInfo};
}

export async function findCategories({
  category = null,
  showAllCategories = false,
  slug = null,
}: {
  category?: any;
  showAllCategories?: boolean;
  slug?: string | null;
}) {
  const c = await getClient();

  const categories = await c.aOSPortalNewsCategory.find({
    where: {
      ...(category
        ? {
            parentCategory: {
              name: {like: `%${category}%`},
            },
          }
        : {
            ...(showAllCategories
              ? {}
              : {
                  parentCategory: {
                    id: {
                      eq: null,
                    },
                  },
                }),
          }),
      ...(slug
        ? {
            parentCategory: {
              slug,
            },
          }
        : {}),
    },
    select: {
      name: true,
      image: true,
      parentCategory: true,
      slug: true,
    },
  });

  return categories;
}

export async function findCategoryTitleBySlugName({
  slug,
}: {
  slug: string | null;
}) {
  const c = await getClient();
  const title = await c.aOSPortalNewsCategory.findOne({
    where: {slug},
    select: {
      name: true,
    },
  });

  return title?.name;
}

export async function addComment({
  id,
  contentComment,
  publicationDateTime,
}: any) {
  const c = await getClient();

  const comment = await c.aOSPortalNews.create({
    data: {
      id,
      portalCommentList: {
        create: [
          {
            contentComment,
            publicationDateTime,
          },
        ],
      },
    },
  });

  return comment;
}
