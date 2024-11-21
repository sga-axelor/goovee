// ---- CORE IMPORTS ---- //
import {filterPrivate} from '@/orm/filter';
import {manager, type Tenant} from '@/tenant';
import type {PortalWorkspace, User} from '@/types';

function transform($categories: any[]) {
  const categories: any = {};

  $categories.forEach(category => {
    categories[category.id] = {
      ...category,
      parent: category.parentProductCategory,
      items: [],
    };
  });

  Object.values(categories).forEach((category: any) => {
    const {parent} = category;
    if (parent && categories[parent.id]) {
      categories[parent.id].items.push(category);
    }
  });

  return Object.values(categories);
}

export async function findCategories({
  workspace,
  tenantId,
  user,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!(workspace && tenantId)) return [];

  const client = await manager.getClient(tenantId);

  const categories = await client.aOSProductCategory.find({
    where: {
      portalWorkspace: {
        id: workspace.id,
      },
      ...(await filterPrivate({user, tenantId})),
    },
    select: {
      name: true,
      parentProductCategory: {id: true},
    },
  });

  return transform(categories);
}

export async function findFeaturedCategories({
  workspace,
  tenantId,
  user,
}: {
  workspace: PortalWorkspace;
  tenantId: Tenant['id'];
  user?: User;
}) {
  if (!(workspace && tenantId)) return [];

  const client = await manager.getClient(tenantId);

  const categories = await client.aOSProductCategory.find({
    where: {
      portalWorkspace: {
        id: workspace.id,
      },
      isFeatured: true,
      ...(await filterPrivate({tenantId, user})),
    },
    select: {
      name: true,
      parentProductCategory: {id: true},
      productList: {
        where: {
          homepage: true,
        },
        orderBy: {
          featured: 'DESC',
        },
        select: {
          id: true,
        },
      },
    },
  });

  return categories;
}
