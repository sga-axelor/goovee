import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {isAdminContact, isPartner} from '@/orm/partner';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import LayoutContent from './layout-content';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();
  if (!session) return notFound();

  const {tenant, workspaceURL} = workspacePathname(params);

  const isAdmin =
    Boolean(await isPartner()) ||
    Boolean(
      await isAdminContact({
        tenantId: tenant,
        workspaceURL,
      }),
    );

  return (
    <div className="p-0 lg:space-y-6 mb-20 lg:py-4 lg:px-12 !lg:mb-6">
      <LayoutContent isAdmin={isAdmin}>{children}</LayoutContent>
    </div>
  );
}
