import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {isAdminContact, isPartner} from '@/orm/partner';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import Sidebar from './sidebar';

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
    (await isPartner()) ||
    (await isAdminContact({
      tenantId: tenant,
      workspaceURL,
    }));

  return (
    <div className="py-2 md:py-4 px-4 md:px-12 space-y-6">
      <h4 className="text-xl font-semibold">
        {await getTranslation('Profile Settings')}
      </h4>
      <div className="grid grid-cols-[15%_1fr] bg-white rounded-md pe-6 py-4 gap-4">
        <Sidebar isAdmin={Boolean(isAdmin)} />
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
}
