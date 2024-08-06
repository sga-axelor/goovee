// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {PortalWorkspace} from '@/types';
import {getPageInfo, getSkipInfo} from '@/utils';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import {DEFAULT_PAGE} from '@/subapps/news/common/constants';

export async function findNews({
  id = '',
  orderBy,
  isFeaturedNews = false,
  page = DEFAULT_PAGE,
  limit,
  slug = null,
  workspace,
  categoryIds = [],
}: {
  id?: string | number;
  orderBy?: any;
  isFeaturedNews?: boolean;
  page?: string | number;
  limit?: number;
  slug?: string | null;
  workspace: any;
  categoryIds?: any[];
}) {
  if (!workspace) return [];

  const c = await getClient();

  const skip = getSkipInfo(limit, page);

  const whereClause = {
    ...(id
      ? {
          id,
        }
      : {}),
    ...(isFeaturedNews ? {isFeaturedNews: true} : {}),
    ...(slug ? {slug} : {}),

    categorySet: {
      workspace: {
        id: workspace.id,
      },
      ...(categoryIds.length > 0
        ? {
            id: {
              in: categoryIds,
            },
          }
        : {}),
    },
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
  workspace,
}: {
  category?: any;
  showAllCategories?: boolean;
  slug?: string | null;
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  const c = await getClient();

  const categories = await c.aOSPortalNewsCategory.find({
    where: {
      workspace: {
        id: workspace.id,
      },
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
      workspace: true,
    },
  });
  return categories;
}

export async function findCategoryTitleBySlugName({
  slug,
  workspace,
}: {
  slug: any;
  workspace: PortalWorkspace;
}) {
  const c = await getClient();
  const title = await c.aOSPortalNewsCategory.findOne({
    where: {
      slug,
      workspace: {
        id: workspace.id,
      },
    },
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
  workspaceURL,
}: any) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.news,
    user,
    url: workspaceURL,
  });

  if (!subapp) {
    return {
      error: true,
      message: i18n.get('Unauthorized'),
    };
  }

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  });

  if (!workspace) {
    return {
      error: true,
      message: i18n.get('Invalid workspace'),
    };
  }

  const c = await getClient();

  const comment = await c.aOSPortalNews.create({
    data: {
      id,
      portalCommentList: {
        create: [
          {
            contentComment,
            publicationDateTime,
            author: {
              select: {
                id: user.id,
              },
            },
          },
        ],
      },
    },
  });
  return {
    success: true,
    data: comment,
  };
}

export async function findNewsByCategory({
  orderBy,
  page,
  limit,
  slug,
  workspace,
  isFeaturedNews,
}: {
  orderBy?: any;
  isFeaturedNews?: boolean;
  page?: string | number;
  limit?: number;
  slug?: string;
  workspace: PortalWorkspace;
}) {
  const categories = await findCategories({showAllCategories: true, workspace});

  const categoryMap = new Map(
    categories.map(category => [Number(category.id), category]),
  );

  const topCategory = categories.find(category => category.slug === slug);

  if (!topCategory) return {news: []};

  const topCategoryId = Number(topCategory.id);

  const gatherCategoryIds = (categoryId: number): number[] => {
    const ids = [categoryId];

    for (const [id, cat] of categoryMap.entries()) {
      if (cat.parentCategory && Number(cat.parentCategory.id) === categoryId) {
        ids.push(...gatherCategoryIds(id));
      }
    }

    return ids;
  };

  const categoryIds: any = gatherCategoryIds(topCategoryId);

  return findNews({
    orderBy,
    isFeaturedNews,
    page,
    limit,
    workspace,
    categoryIds,
  });
}
