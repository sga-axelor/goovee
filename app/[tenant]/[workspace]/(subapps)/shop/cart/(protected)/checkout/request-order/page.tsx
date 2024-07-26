// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findWorkspace, findSubappAccess} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import Content from './content';

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

  const orderSubapp = await findSubappAccess({
    code: SUBAPP_CODES.orders,
    user: session?.user,
    url: workspaceURL,
  });

  return <Content workspace={workspace} orderSubapp={Boolean(orderSubapp)} />;
}
