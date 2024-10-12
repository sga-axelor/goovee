import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findSubappAccess} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

export const metadata: Metadata = {
  title: i18n.get('Ticketing'),
};

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

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.ticketing,
    user,
    url: workspacePathname(params)?.workspaceURL,
  });

  if (!subapp) return notFound();

  return <div className="lg:mb-0 mb-[72px]">{children}</div>;
}
