import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {SUBAPP_CODES} from '@/constants';
import type {Partner, User} from '@/types';
import {findDeliveryAddresses, findInvoicingAddresses} from '@/orm/address';

// ---- LOCAL IMPORTS ---- //
import {findQuotation} from '@/subapps/quotations/common/orm/quotations';
import {getWhereClause} from '@/subapps/quotations/common/utils/quotations';
import Content from '@/subapps/quotations/[id]/address/content';

export default async function Page({
  params,
}: {
  params: {id: string; tenant: string; workspace: string};
}) {
  const {id, tenant} = params;

  const session = await getSession();
  const user: any = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace: any = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspaceURL,
    tenantId: tenant,
  });

  const {id: userId, isContact, mainPartnerId} = user as User;

  const where = getWhereClause(
    isContact as boolean,
    subapp?.role,
    userId,
    mainPartnerId as string,
  );

  const quotation = await findQuotation({
    id,
    tenantId: tenant,
    params: {where},
  }).then(clone);

  if (!quotation) {
    return notFound();
  }

  const deliveryAddresses: any = await findDeliveryAddresses(
    session?.user?.id as Partner['id'],
    tenant,
  ).then(clone);

  const invoicingAddresses: any = await findInvoicingAddresses(
    session?.user?.id as Partner['id'],
    tenant,
  ).then(clone);

  return (
    <Content
      quotation={quotation}
      invoicingAddresses={invoicingAddresses}
      deliveryAddresses={deliveryAddresses}
    />
  );
}
