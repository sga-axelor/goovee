import React from 'react';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ---- //
import {findSubappAccess} from '@/orm/subapps';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/lib/i18n';

export const metadata: Metadata = {
  title: i18n.get('Orders'),
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
  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.orders,
    user: (await getSession())?.user,
    workspaceURL: workspacePathname(params)?.workspaceURL,
  });

  if (!subapp) return notFound();

  return <>{children}</>;
}
