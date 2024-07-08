import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

export default async function Page({
  params,
}: {
  params: {workspace: string; tenant: string};
}) {
  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  if (!workspaceURL) {
    return notFound();
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  });

  if (!workspace?.config?.publicEshop) {
    return notFound();
  }

  redirect(`${workspaceURL}/shop`);
}
