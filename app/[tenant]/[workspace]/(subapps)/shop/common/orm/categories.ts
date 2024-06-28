// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {PortalWorkspace} from '@/types';

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
}: {
  workspace: PortalWorkspace;
}) {
  if (!workspace) return [];

  const client = await getClient();

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
