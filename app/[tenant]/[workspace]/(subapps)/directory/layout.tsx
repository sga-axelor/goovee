import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

export default async function Layout({
  params,
  children,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
  children: ReactNode;
}) {
  const user = (await getSession())?.user;

  // TODO: check if user auth is required
  // if (!user) return notFound();

  const {tenant} = params;

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.directory,
    user,
    url: workspacePathname(params)?.workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  return <div className="mb-[72px] lg:mb-0">{children}</div>;
}
