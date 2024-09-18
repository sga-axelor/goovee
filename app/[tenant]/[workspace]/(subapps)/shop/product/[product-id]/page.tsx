import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone, isNumeric} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {ProductView} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/ui/components';
import {findProduct} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/orm/product';
import {findCategories} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/orm/categories';

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

  const workspace = await findWorkspace({
    user: user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!(id && isNumeric(id))) redirect(`${workspaceURI}/shop`);

  const computedProduct = await findProduct({
    id,
    workspace,
    user,
    tenantId: tenant,
  });

  if (!computedProduct) redirect(`${workspaceURI}/shop`);

  let breadcrumbs: any = [];
  const {product} = computedProduct;

  if (breadcrumbs.length) {
    breadcrumbs.push({id: product.id, name: product.name});
  }

  const categories = await findCategories({workspace, tenantId: tenant}).then(
    clone,
  );
  const parentcategories = categories?.filter((c: any) => !c.parent);

  return (
    <ProductView
      product={clone(computedProduct)}
      workspace={workspace}
      breadcrumbs={breadcrumbs}
      categories={parentcategories}
    />
  );
}
