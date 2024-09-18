import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {SUBAPP_CODES} from '@/constants';
import {workspacePathname} from '@/utils/workspace';
import type {User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findInvoice} from '@/subapps/invoices/common/orm/invoices';
import {getWhereClause} from '@/subapps/invoices/common/utils/invoices';

export default async function Page({
  params,
}: {
  params: {id: string; tenant: string; workspace: string};
}) {
  const {id, tenant} = params;

  const session = await getSession();

  if (!session) return notFound();

  const user = session?.user as User;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user,
    url: workspacePathname(params)?.workspaceURL,
    tenantId: tenant,
  });

  if (!app?.installed) {
    return notFound();
  }

  const {id: userId, isContact, mainPartnerId} = user;
  const {role} = app;

  const invoice = await findInvoice({
    id,
    params: {
      where: getWhereClause(isContact, role, userId, mainPartnerId),
    },
    tenantId: tenant,
  });

  return <Content invoice={clone(invoice)} workspace={workspace} />;
}
