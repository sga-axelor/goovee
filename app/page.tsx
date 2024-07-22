export const dynamic = 'force-dynamic';

import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findWorkspaces, findSubapps} from '@/orm/workspace';
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';

export default async function Page({
  searchParams,
}: {
  searchParams: {workspaceURI?: string};
}) {
  const session = await getSession();
  const user = session?.user;

  const workspaces = await findWorkspaces({
    url: process.env.NEXT_PUBLIC_HOST,
  });

  if (!workspaces?.length) return notFound();

  const {workspaceURI} = searchParams;

  if (workspaceURI) {
    const url = `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`;

    const workspaceApps = await findSubapps({
      user,
      url,
    }).then(clone);

    if (workspaceApps?.length) {
      return redirect(`${url}/${workspaceApps[0].code}`);
    }
  }

  let redirectURL;

  for (const w of workspaces) {
    const apps = await findSubapps({url: w.url!, user});
    if (apps?.length) {
      redirectURL = `${w.url}/${apps[0].code}`;
      break;
    }
  }

  if (!redirectURL) {
    notFound();
  }

  return redirect(redirectURL);
}
