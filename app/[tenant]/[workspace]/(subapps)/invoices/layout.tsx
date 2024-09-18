import React from 'react';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findSubappAccess} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/i18n';

export const metadata: Metadata = {
  title: i18n.get('Invoices'),
};

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
  const {tenant} = params;

  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  return <>{children}</>;
}
