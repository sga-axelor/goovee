import React from 'react';
import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();

  const {workspaceURI} = workspacePathname(params);

  if (!session?.user) {
    redirect(`/auth/login?workspaceURI=${encodeURIComponent(workspaceURI)}`);
  }

  return <>{children}</>;
}
