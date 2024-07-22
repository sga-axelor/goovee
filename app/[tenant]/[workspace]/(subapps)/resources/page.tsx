// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import {
  fetchLatestFiles,
  fetchLatestFolders,
} from '@/subapps/resources/common/orm/dms';
import Content from '@/subapps/resources/content';

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

  return <Content folders={folders} files={files} workspace={workspace} />;
}
