import React from 'react';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace, findWorkspaces} from '@/orm/workspace';
import {findSubapps} from '@/orm/subapps';

// ---- LOCAL IMPORTS ---- //
import Workspace from './workspace-context';
import CartContext from './cart-context';
import Header from './header';
import Sidebar from './sidebar';
import MobileMenu from './mobile-menu';

export default async function Layout({
  params,
  children,
}: {
  params: {tenant: string; workspace: string};
  children: React.ReactNode;
}) {
  const workspaces = await findWorkspaces({
    url: process.env.NEXT_PUBLIC_HOST,
  }).then(clone);

  const {workspace, tenant, workspaceURL} = workspacePathname(params);

  const session = await getSession();

  const $workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  let theme;

  try {
    if ($workspace?.defaultTheme) {
      theme = $workspace.defaultTheme;
      theme.options = JSON.parse($workspace?.defaultTheme?.css || null);
    }
  } catch (err: any) {
    console.error(err.message);
  }

  const subapps = await findSubapps({
    workspace: $workspace,
    user: session?.user,
  });

  return (
    <Workspace workspace={workspace} tenant={tenant} theme={theme}>
      <CartContext>
        <div className="h-full w-full flex">
          <Sidebar subapps={subapps} workspaces={workspaces} />
          <div className="max-h-full max-w-full flex-1 flex flex-col">
            <Header subapps={subapps} />
            {children}
          </div>
          <MobileMenu subapps={subapps} workspaces={workspaces} />
        </div>
      </CartContext>
    </Workspace>
  );
}
