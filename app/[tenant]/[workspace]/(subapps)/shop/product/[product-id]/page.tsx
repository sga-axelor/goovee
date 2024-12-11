import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone, isNumeric} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {ProductView} from '@/subapps/shop/common/ui/components';
import {findProduct} from '@/subapps/shop/common/orm/product';
import {findCategories} from '@/subapps/shop/common/orm/categories';
import {getcategoryids} from '@/subapps/shop/common/utils/categories';
import {findModelFields} from '@/subapps/events/common/orm/meta-json-field';
import {
  BASE_PRODUCT_MODEL,
  PRODUCT_ATTRS,
} from '@/subapps/shop/common/constants';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string; 'product-id': string};
  searchParams: {[key: string]: string};
}) {
  const {tenant} = params;
  const session = await getSession();
  const user = session?.user;

  const id = params['product-id']?.split('-')?.at(-1);
  const {workspaceURL, workspaceURI} = workspacePathname(params);

  if (!(id && isNumeric(id))) redirect(`${workspaceURI}/shop`);

  const workspace = await findWorkspace({
    user: user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const categories = await findCategories({workspace, tenantId: tenant}).then(
    clone,
  );

  const categoryids = categories.map(c => getcategoryids(c)).flat();

  const computedProduct = await findProduct({
    id,
    workspace,
    user,
    tenantId: tenant,
    categoryids,
  });

  const metaFields = await findModelFields({
    modelName: BASE_PRODUCT_MODEL,
    modelField: PRODUCT_ATTRS,
    tenantId: tenant,
  }).then(clone);

  if (!computedProduct) redirect(`${workspaceURI}/shop`);

  let breadcrumbs: any = [];
  const {product} = computedProduct;

  if (breadcrumbs.length) {
    breadcrumbs.push({id: product.id, name: product.name});
  }

  const parentcategories = categories?.filter((c: any) => !c.parent);

  return (
    <ProductView
      product={clone(computedProduct)}
      workspace={workspace}
      breadcrumbs={breadcrumbs}
      categories={parentcategories}
      metaFields={metaFields}
    />
  );
}
