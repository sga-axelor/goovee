import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findWorkspaces} from '@/orm/workspace';
import {SEARCH_PARAMS} from '@/constants';

export default async function Page({
  searchParams,
}: {
  searchParams: {[key: string]: string};
}) {
  const session = await getSession();

  const workspaceURISearchParam = searchParams?.workspaceURI;

  const workspaceURI = workspaceURISearchParam
    ? decodeURIComponent(workspaceURISearchParam)
    : '';

  const tenantIdSearchParam = searchParams?.[SEARCH_PARAMS.TENANT_ID];

  const tenantId = tenantIdSearchParam
    ? decodeURIComponent(tenantIdSearchParam)
    : '';

  if (session?.user) {
    redirect('/');
  }

  const workspaceURL = workspaceURI
    ? `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`
    : '';

  let canRegister;

  if (workspaceURL) {
    const workspaces = await findWorkspaces({url: workspaceURL, tenantId});
    const workspace = workspaces.find((w: any) => w.url === workspaceURL);
    canRegister = workspace?.allowRegistrationSelect === 'yes';
  }

  return <Content canRegister={canRegister} />;
}
