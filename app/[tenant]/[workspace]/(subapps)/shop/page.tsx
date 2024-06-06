// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {DEFAULT_LIMIT} from '@/constants';
import type {Category} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {ProductList} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/ui/components';
import {findProducts} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/orm/product';
import {findCategories} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/orm/categories';

export default async function Shop({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {[key: string]: string | undefined};
}) {
  const {search, sort, limit, page} = searchParams;

  const session = await getSession();

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
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

  const {products, pageInfo}: any = await findProducts({
    search,
    sort,
    page,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    workspace,
  });

  const parentcategories = categories?.filter((c: any) => !c.parent);

  return (
    <ProductList
      products={clone(products)}
      categories={parentcategories}
      pageInfo={pageInfo}
      workspace={workspace}
      showSummary={true}
      productPath={`${workspaceURI}/shop/product/`}
    />
  );
}
