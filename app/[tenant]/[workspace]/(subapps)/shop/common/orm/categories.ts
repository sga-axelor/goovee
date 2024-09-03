// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {ID, PortalWorkspace} from '@/types';

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
}: {
  workspace: PortalWorkspace;
  tenantId: ID;
}) {
  if (!(workspace && tenantId)) return [];

  const client = await getClient(tenantId);

  const categories = await client.aOSProductCategory.find({
    where: {
      portalWorkspace: {
        id: workspace.id,
      },
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
}: {
  workspace: PortalWorkspace;
  tenantId: ID;
}) {
  if (!(workspace && tenantId)) return [];

  const client = await getClient(tenantId);

  const categories = await client.aOSProductCategory.find({
    where: {
      portalWorkspace: {
        id: workspace.id,
      },
      isFeatured: true,
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
