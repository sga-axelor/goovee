import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- ///
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/auth';
import {DEFAULT_LIMIT} from '@/constants';
import type {Category, PortalAppConfig} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {ProductList} from '@/subapps/shop/common/ui/components';
import {findProducts} from '@/subapps/shop/common/orm/product';
import {findCategories} from '@/subapps/shop/common/orm/categories';
import {SORT_BY_OPTIONS} from '@/subapps/shop/common/constants';

export default async function Shop({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'category-id': string};
  searchParams: {[key: string]: string | undefined};
}) {
  const {tenant} = params;
  const {search, limit, page, sort} = searchParams;

  const category = params['category-id']?.split('-')?.at(-1);

  const session = await getSession();
  const user = session?.user;

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const categories = await findCategories({workspace, tenantId: tenant}).then(
    clone,
  );

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

  const $category = category
    ? categories.find((c: any) => Number(c.id) === Number(category))
    : null;

  if (!$category) {
    return redirect(`${workspaceURI}/shop`);
  }

  const categoryids = $category ? getcategoryids($category) : [];

  const breadcrumbs = $category ? getbreadcrumbs($category) : [];

  const availableSortByOptions = SORT_BY_OPTIONS.filter(
    o =>
      workspace?.config &&
      (workspace?.config?.[o.value as keyof PortalAppConfig] as boolean),
  );

  const defaultSort = availableSortByOptions?.[0]?.value;

  const {products, pageInfo}: any = await findProducts({
    search,
    sort: sort || defaultSort,
    page,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    categoryids,
    workspace,
    user,
    tenantId: tenant,
  });

  const parentcategories = categories?.filter((c: any) => !c.parent);

  return (
    <ProductList
      products={clone(products)}
      breadcrumbs={breadcrumbs}
      category={$category}
      categories={parentcategories}
      pageInfo={pageInfo}
      workspace={workspace}
      productPath={`${workspaceURI}/shop/category/${$category.id}/product/`}
      defaultSort={defaultSort}
    />
  );
}
