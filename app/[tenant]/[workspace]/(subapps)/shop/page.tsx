// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import type {Category} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {FeaturedCategories} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/ui/components';
import {findProducts} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/orm/product';
import {
  findCategories,
  findFeaturedCategories,
} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/orm/categories';

export default async function Shop({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();
  const user = session?.user;

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  }).then(clone);

  const categories = await findCategories({workspace}).then(clone);

  const getcategoryids = (category: Category) => {
    if (!category) return [];

    let ids: Category['id'][] = [category.id];

    if (category?.items?.length) {
      ids = [...ids, ...category.items.map(getcategoryids).flat()];
    }

    return ids.flat();
  };

  const getbreadcrumbs: any = (category: any) => {
    if (!category) return [];

    let breadcrumbs: any = [];

    if (category?.parent?.id) {
      breadcrumbs = [
        ...getbreadcrumbs(
          categories.find((c: any) => c.id === category?.parent?.id),
        ),
      ];
    }

    breadcrumbs.push({id: category.id, name: category.name});

    return breadcrumbs;
  };

  const parentcategories = categories?.filter((c: any) => !c.parent);

  const featuredCategories: any = await findFeaturedCategories({
    workspace,
  }).then(clone);

  for (const category of featuredCategories) {
    if (category?.productList?.length) {
      const res = await findProducts({
        ids: category.productList.map((p: any) => p.id),
        workspace,
        user,
      }).then(clone);

      category.products = res?.products;
    }
  }

  return (
    <FeaturedCategories
      categories={parentcategories}
      featuredCategories={featuredCategories}
      workspace={workspace}
      productPath={`${workspaceURI}/shop/product/`}
    />
  );
}
