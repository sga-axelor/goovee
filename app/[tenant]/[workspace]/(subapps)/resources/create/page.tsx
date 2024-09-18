import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {i18n} from '@/i18n';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import {fetchSharedFolders} from '@/subapps/resources/common/orm/dms';
import ResourceForm from './form';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {tenant} = params;
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return notFound();
  }

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const folders = await fetchSharedFolders({
    workspace,
    tenantId: tenant,
  }).then(clone);

  return (
    <main className="container mx-auto mt-4 p-4 md:p-8 bg-white rounded space-y-2">
      <h2 className="font-semibold text-lg">{i18n.get('Create a resource')}</h2>
      <ResourceForm categories={folders} />
    </main>
  );
}
