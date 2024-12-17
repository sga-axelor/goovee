import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/auth';
import {DEFAULT_LIMIT, SUBAPP_CODES} from '@/constants';
import {clone} from '@/utils';
import {User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findArchivedOrders} from '@/subapps/orders/common/orm/orders';
import {getWhereClause} from '@/subapps/orders/common/utils/orders';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {[key: string]: string | undefined};
}) {
  const {tenant} = params;

  const {limit, page} = searchParams;
  const session = await getSession();
  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp({
    code: SUBAPP_CODES.orders,
    url: workspace.url,
    user: session?.user,
    tenantId: tenant,
  });

  if (!app?.installed) {
    return notFound();
  }

  const user = session?.user as User;
  const {role, isContactAdmin} = app;

  const where = getWhereClause({
    user,
    role,
    isContactAdmin,
  });

  const {orders, pageInfo} = await findArchivedOrders({
    partnerId: session?.user?.id,
    page,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    where,
    tenantId: tenant,
    workspaceURL,
  });

  return <Content orders={clone(orders)} pageInfo={pageInfo} />;
}
