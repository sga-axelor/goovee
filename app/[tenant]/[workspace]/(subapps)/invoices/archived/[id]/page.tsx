import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
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
  const {id} = params;

  const session = await getSession();
  const {id: userId, isContact, mainPartnerId} = session?.user as User;

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user: (await getSession())?.user,
    url: workspacePathname(params)?.workspaceURL,
  });

  if (!subapp?.installed) {
    return notFound();
  }

  const {role} = subapp;

  const where = getWhereClause(isContact, role, userId, mainPartnerId);

  const invoice = await findInvoice(id, {where});

  return <Content invoice={clone(invoice)} />;
}
