// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {PortalWorkspace} from '@/types';

function transform($categories: any[]) {
  const categories: any = {};

  const get = (category: any) => {
    if (!categories[category.id]) {
      categories[category.id] = {
        id: category.id,
        name: category.name,
        title: category.name,
        parent: category.parentProductCategory,
        items: category?.items ? [] : null,
      };
    }

    return categories[category.id];
  };

  $categories.forEach(c => {
    const category = get(c);

    if (category.parent) {
      get(category.parent).items.push(category);
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
      items: {
        id: true,
        name: true,
        parentProductCategory: {
          id: true,
        },
      },
      parentProductCategory: {id: true},
    },
  });

  return transform(categories);
}
