// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {getPageInfo, getSkipInfo} from '@/utils';
import type {PortalWorkspace, User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {DEFAULT_PAGE} from '@/subapps/news/common/constants';
import {filterPrivate} from '@/orm/filter';

export async function findNews({
  id = '',
  orderBy,
  isFeaturedNews = false,
  page = DEFAULT_PAGE,
  limit,
  slug = null,
  workspace,
  categoryIds = [],
  tenantId,
  user,
}: {
  id?: string | number;
  orderBy?: any;
  isFeaturedNews?: boolean;
  page?: string | number;
  limit?: number;
  slug?: string | null;
  workspace: any;
  categoryIds?: any[];
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!(workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const skip = getSkipInfo(limit, page);

  const whereClause = {
    ...(id
      ? {
          id,
        }
      : {}),
    ...(isFeaturedNews ? {isFeaturedNews: true} : {}),
    ...(slug ? {slug} : {}),
    ...(await filterPrivate({user, tenantId})),
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
        attachmentList: {
          select: {
            title: true,
            metaFile: {
              id: true,
              fileName: true,
              fileSize: true,
              sizeText: true,
              fileType: true,
            },
          },
        },
        slug: true,
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
  tenantId,
  user,
}: {
  category?: any;
  showAllCategories?: boolean;
  slug?: string | null;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!(workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const categories = await c.aOSPortalNewsCategory.find({
    where: {
      workspace: {
        id: workspace.id,
      },
      ...(await filterPrivate({user, tenantId})),
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
  tenantId,
}: {
  slug: any;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return null;
  }

  const c = await manager.getClient(tenantId);

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

export async function findNewsByCategory({
  orderBy,
  page,
  limit,
  slug,
  workspace,
  isFeaturedNews,
  tenantId,
  user,
}: {
  orderBy?: any;
  isFeaturedNews?: boolean;
  page?: string | number;
  limit?: number;
  slug?: string;
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!tenantId) {
    return [];
  }

  const categories = await findCategories({
    showAllCategories: true,
    workspace,
    tenantId,
    user,
  });

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
    tenantId,
    user,
  });
}
