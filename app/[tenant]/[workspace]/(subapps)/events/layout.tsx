import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';
import {clone} from '@/utils';
import {findWorkspace, findSubappAccess} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import {findEventCategories} from '@/subapps/events/common/orm/event-category';
import {MobileMenuCategory} from '@/subapps/events/common/ui/components';

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
    code: SUBAPP_CODES.events,
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const categories = await findEventCategories({
    workspace,
    tenantId: tenant,
  }).then(clone);

  return (
    <>
      {children}
      <MobileMenuCategory categories={categories} />
    </>
  );
}
