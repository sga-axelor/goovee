import {Suspense} from 'react';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import type {Cart} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {CartSkeleton} from '@/subapps/shop/common/ui/components';

async function CartView({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {tenant} = params;
  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  return <Content workspace={workspace} tenant={tenant} />;
}

export default async function Cart({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartView params={params} />
    </Suspense>
  );
}
