import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {t} from '@/locale/server';
import {workspacePathname} from '@/utils/workspace';
import {ensureAuth} from './common/utils/auth-helper';

export async function generateMetadata() {
  return {
    title: await t('Ticketing'),
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: {tenant: string; workspace: string};
  children: ReactNode;
}) {
  const {workspaceURL, tenant} = workspacePathname(params);
  const {error} = await ensureAuth(workspaceURL, tenant);
  if (error) notFound();

  return <div className="mb-[72px] lg:mb-0">{children}</div>;
}
