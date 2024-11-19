import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import CategoryForm from './form';
import {
  fetchColors,
  fetchIcons,
  fetchSharedFolders,
} from '@/subapps/resources/common/orm/dms';

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

  const colors = await fetchColors().then(clone);
  const icons = await fetchIcons().then(clone);

  return (
    <main className="container mx-auto mt-4 p-4 md:p-8 bg-white rounded space-y-2">
      <h2 className="font-semibold text-lg">
        {await getTranslation('Create a category')}
      </h2>
      <CategoryForm categories={folders} colors={colors} icons={icons} />
    </main>
  );
}
