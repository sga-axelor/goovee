import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {SUBAPP_CODES} from '@/constants';
import {findSubappAccess} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {TemplateRoot} from './template-root';

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
  const session = await getSession();
  const user = session?.user;

  const {tenant} = params;
  const {workspaceURL} = workspacePathname(params);

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.website,
    user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  return (
    <div className="!mb-20 md:mb-0 h-full">
      <TemplateRoot>{children}</TemplateRoot>
    </div>
  );
}
