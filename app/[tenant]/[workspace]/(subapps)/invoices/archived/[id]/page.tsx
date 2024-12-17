import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findSubappAccess} from '@/orm/workspace';
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
  const {workspaceURL} = workspacePathname(params);

  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return notFound();
  }

  const app = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!app?.installed) {
    return notFound();
  }

  const {role, isContactAdmin} = app;

  const invoice = await findInvoice({
    id,
    params: {
      where: getWhereClause({
        user: user as User,
        role,
        isContactAdmin,
      }),
    },
    tenantId: tenant,
    workspaceURL,
  });

  if (!invoice) {
    return notFound();
  }

  return <Content invoice={invoice} />;
}
