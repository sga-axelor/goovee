import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/auth';
import {i18n} from '@/locale';

// ---- LOCAL IMPORTS ---- //
import {
  fetchLatestFiles,
  fetchLatestFolders,
} from '@/subapps/resources/common/orm/dms';
import {ResourceList} from '@/subapps/resources/common/ui/components';
import Categories from './categories';
import Hero from './hero';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {tenant} = params;
  const session = await getSession();
  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) {
    return notFound();
  }

  const files = await fetchLatestFiles({
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  const folders = await fetchLatestFolders({
    workspace,
    tenantId: tenant,
    user,
  }).then(clone);

  return (
    <>
      <Hero workspace={workspace} workspaceURL={workspaceURL} />
      <main className="container p-4 mx-auto space-y-6">
        <Categories items={folders} />
        <h2 className="font-semibold text-xl">{i18n.t('New Resources')}</h2>
        <ResourceList resources={files} />
      </main>
    </>
  );
}
