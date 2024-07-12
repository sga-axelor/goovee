// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
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
  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const folders = await fetchSharedFolders({workspace}).then(clone);

  const colors = await fetchColors().then(clone);
  const icons = await fetchIcons().then(clone);

  return (
    <main className="container mx-auto mt-4 p-4 md:p-8 bg-white rounded space-y-2">
      <h2 className="font-semibold text-lg">{i18n.get('Create a category')}</h2>
      <CategoryForm categories={folders} colors={colors} icons={icons} />
    </main>
  );
}
