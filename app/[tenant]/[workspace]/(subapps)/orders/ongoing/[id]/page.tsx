// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findOrder} from '@/subapps/orders/common/orm/orders';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string; id: string};
}) {
  const {id, tenant} = params;

  const order = await findOrder({id, tenantId: tenant});
  return <Content order={clone(order)} />;
}
