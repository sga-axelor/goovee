import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findWorkspaces} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import Content from './content';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    workspaceURI?: string;
  };
}) {
  const workspaceURI =
    searchParams?.workspaceURI && decodeURIComponent(searchParams.workspaceURI);

  const workspaceURL = workspaceURI
    ? `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`
    : '';

  if (!workspaceURL) {
    return notFound();
  }

  const workspaces = await findWorkspaces({url: workspaceURL});

  const workspace = workspaces.find((w: any) => w.url === workspaceURL);

  const canRegister = workspace?.allowRegistrationSelect === 'yes';

  if (!canRegister) {
    return notFound();
  }

  return <Content />;
}
