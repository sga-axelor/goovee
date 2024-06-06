// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import type {Cart} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from './content';

export default async function Cart({
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

  return <Content workspace={workspace} />;
}
