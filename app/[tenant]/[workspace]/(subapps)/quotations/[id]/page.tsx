import React from 'react';
import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import type {User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {
  findQuotation,
  getComments,
} from '@/subapps/quotations/common/orm/quotations';
import {SUBAPP_CODES} from '@/constants';
import {getWhereClause} from '@/subapps/quotations/common/utils/quotations';

type PageProps = {
  params: {
    id: any;
    tenant: string;
    workspace: string;
  };
};
export default async function Page({params}: PageProps) {
  const {id} = params;

  const comments = await getComments(id);

  const session = await getSession();
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user,
    url: workspaceURL,
  });

  const {id: userId, isContact, mainPartnerId} = user as User;

  const where = getWhereClause(
    isContact as boolean,
    subapp?.role,
    userId,
    mainPartnerId as string,
  );

  const quotation = await findQuotation(id, {where});

  const orderSubapp = await findSubappAccess({
    code: SUBAPP_CODES.orders,
    user,
    url: workspaceURL,
  });

  return (
    <Content
      quotation={clone(quotation)}
      comments={clone(comments)}
      workspace={workspace}
      orderSubapp={Boolean(orderSubapp)}
    />
  );
}
