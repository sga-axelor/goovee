import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {findSubappAccess} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

export async function generateMetadata() {
  return {
    title: await getTranslation('Ticketing'),
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
  children: ReactNode;
}) {
  const user = (await getSession())?.user;

  if (!user) return notFound();

  const {tenant} = params;

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.ticketing,
    user,
    url: workspacePathname(params)?.workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  return <div className="mb-[72px] lg:mb-0">{children}</div>;
}
