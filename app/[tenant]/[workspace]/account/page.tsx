import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findWorkspace, findSubapps} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import Content from './content';

export default async function Account({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();

  if (!session) return notFound();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const subapps = await findSubapps({url: workspace.url, user: session?.user});

  return <Content subapps={subapps} />;
}
