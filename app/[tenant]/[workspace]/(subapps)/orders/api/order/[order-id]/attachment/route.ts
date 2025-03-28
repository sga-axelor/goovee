import {NextRequest, NextResponse} from 'next/server';

// ---- CORE IMPORTS ---- //
import {RELATED_MODELS, SUBAPP_CODES} from '@/constants';
import {getSession} from '@/lib/core/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {findLatestDMSFileByName, streamFile} from '@/utils/download';
import {workspacePathname} from '@/utils/workspace';
import {getWhereClauseForEntity} from '@/utils/filters';
import {PartnerKey} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findOrder} from '@/subapps/orders/common/orm/orders';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      tenant: string;
      workspace: string;
      'order-id': string;
    };
  },
) {
  const {workspaceURL, tenant: tenantId} = workspacePathname(params);
  const {'order-id': orderId} = params;

  const session = await getSession();

  const user = session!.user;

  if (!user) {
    return new NextResponse('Unauthorized', {status: 401});
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return new NextResponse('Invalid workspace', {status: 401});
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user: session?.user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return new NextResponse('Unauthorized', {status: 401});
  }

  const orderWhereClause = getWhereClauseForEntity({
    user,
    role: subapp.role,
    isContactAdmin: subapp.isContactAdmin,
    partnerKey: PartnerKey.CLIENT_PARTNER,
  });

  const order = await findOrder({
    id: orderId,
    tenantId,
    workspaceURL,
    params: {where: orderWhereClause},
  });

  if (!order) {
    return new NextResponse('Order not found', {status: 404});
  }

  const file = await findLatestDMSFileByName({
    tenant: tenantId,
    user,
    relatedId: orderId,
    relatedModel: RELATED_MODELS.SALE_ORDER,
    name: order.saleOrderSeq || '',
  });

  if (!file) {
    return new NextResponse('File not found', {status: 404});
  }

  return streamFile(file);
}
