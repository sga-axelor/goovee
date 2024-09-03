import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findSubapps} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

export default async function Page({
  params,
}: {
  params: {workspace: string; tenant: string};
}) {
  const {tenant} = params;
  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  if (!workspaceURL) {
    return notFound();
  }

  const apps = await findSubapps({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!apps?.length) {
    return notFound();
  }

  redirect(`${workspaceURL}/${apps[0].code}`);
}
