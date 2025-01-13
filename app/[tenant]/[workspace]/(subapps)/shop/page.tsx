import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';

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
  const {tenant} = params;

  const session = await getSession();
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const categories = await findCategories({
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

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
    tenantId: tenant,
    user,
  }).then(clone);

  for (const category of featuredCategories) {
    if (category?.productList?.length) {
      const res: any = await findProducts({
        ids: category.productList.map((p: any) => p.id),
        workspace,
        user,
        tenantId: tenant,
        categoryids: [category.id],
      }).then(clone);

      category.products = res?.products;
    }
  }

  return (
    <FeaturedCategories
      categories={parentcategories}
      featuredCategories={featuredCategories}
      workspace={workspace}
    />
  );
}
