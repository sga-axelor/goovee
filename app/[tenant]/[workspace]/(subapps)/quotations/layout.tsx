import React from 'react';
import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findSubappAccess} from '@/orm/workspace';
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';
import {getTranslation} from '@/i18n/server';

export async function generateMetadata() {
  return {
    title: await getTranslation('Quotations'),
  };
}

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

  const user = session?.user;

  if (!user) {
    return notFound();
  }

  const {workspaceURL} = workspacePathname(params);

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  return <div className="container !mb-20 md:mb-0">{children}</div>;
}
