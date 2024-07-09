import React from 'react';
import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findSubappAccess} from '@/orm/subapps';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';

export default async function Layout({
  params,
  children,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
  children: React.ReactNode;
}) {
  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.orders,
    user: (await getSession())?.user,
    workspaceURL: workspacePathname(params)?.workspaceURL,
  });

  if (!subapp) return notFound();

  return <>{children}</>;
}
