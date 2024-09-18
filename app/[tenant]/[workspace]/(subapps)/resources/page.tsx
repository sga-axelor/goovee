// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/auth';
import {i18n} from '@/i18n';

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

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const files = await fetchLatestFiles({
    workspace,
    tenantId: tenant,
  }).then(clone);

  const folders = await fetchLatestFolders({
    workspace,
    tenantId: tenant,
  }).then(clone);

  return (
    <>
      <Hero workspace={workspace} />
      <main className="container p-4 mx-auto space-y-6">
        <Categories items={folders} />
        <h2 className="font-semibold text-xl">{i18n.get('New Resources')}</h2>
        <ResourceList resources={files} />
      </main>
    </>
  );
}
