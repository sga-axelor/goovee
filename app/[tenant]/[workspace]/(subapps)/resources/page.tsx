// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {Banner} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import {
  fetchLatestFiles,
  fetchLatestFolders,
} from '@/subapps/resources/common/orm/dms';
import {ResourceList} from '@/subapps/resources/common/ui/components';
import {
  BANNER_DESCRIPTION,
  BANNER_TITLE,
} from '@/subapps/resources/common/constants';
import Categories from './categories';
import Search from './search';

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

  const files = await fetchLatestFiles({workspace}).then(clone);
  const folders = await fetchLatestFolders({workspace}).then(clone);

  return (
    <>
      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION}>
        <Search workspace={workspace} />
      </Banner>
      <main className="container p-4 mx-auto space-y-6">
        <Categories items={folders} />
        <h2 className="font-semibold text-xl">{i18n.get('New Resources')}</h2>
        <ResourceList resources={files} />
      </main>
    </>
  );
}
