import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findWorkspace, findWorkspaces} from '@/orm/workspace';
import {findSubapp} from '@/orm/subapps';
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';

export default async function Page({
  searchParams,
}: {
  searchParams: {workspaceURI?: string};
}) {
  
  const session = await getSession();

  const workspaces = await findWorkspaces({
    url: process.env.NEXT_PUBLIC_HOST,
  });

  if (!workspaces?.length) return notFound();

  const {workspaceURI} = searchParams;

  let workspace: any;

  if (workspaceURI) {
    const workspaceURL = `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`;

    const $workspace = await findWorkspace({
      user: session?.user,
      url: workspaceURL,
    }).then(clone);

    if ($workspace) {
      const ispublic = $workspace?.config?.publicEshop;

      if (ispublic) {
        workspace = $workspace;
        workspace.url = workspaceURL;
      } else if (session) {
        const app = await findSubapp('shop', {
          workspace,
          user: session?.user,
        });

        if (app?.installed) {
          workspace = $workspace;
          workspace.url = workspaceURL;
        }
      }
    }
  } else {
    workspace = workspaces.find((w: any) => w?.appConfig?.publicEshop);
  }

  if (!workspace) {
    notFound();
  }

  return redirect(`${workspace.url}/shop`);
}
