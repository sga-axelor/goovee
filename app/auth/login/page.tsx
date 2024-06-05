import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findWorkspaces} from '@/orm/workspace';

export default async function Page({
  searchParams,
}: {
  searchParams: {workspaceURI?: string};
}) {
  const session = await getSession();

  const workspaceURI = searchParams?.workspaceURI
    ? decodeURIComponent(searchParams.workspaceURI)
    : '';

  if (session?.user) {
    redirect(`${workspaceURI}/account`);
  }

  const workspaceURL = workspaceURI
    ? `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`
    : '';

  let canRegister;

  if (workspaceURL) {
    const workspaces = await findWorkspaces({url: workspaceURL});
    const workspace = workspaces.find((w: any) => w.url === workspaceURL);
    canRegister = workspace?.allowRegistrationSelect === 'yes';
  }

  return <Content canRegister={canRegister} />;
}
