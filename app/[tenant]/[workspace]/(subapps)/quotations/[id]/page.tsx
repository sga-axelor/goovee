import React from 'react';
import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {
  findQuotation,
  getComments,
} from '@/subapps/quotations/common/orm/quotations';
import {SUBAPP_CODES} from '@/constants';

type PageProps = {
  params: {
    id: any;
    tenant: string;
    workspace: string;
  };
};
export default async function Page({params}: PageProps) {
  const {id} = params;

  const quotation = await findQuotation(id);

  const comments = await getComments(id);

  const session = await getSession();
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

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
