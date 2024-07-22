import React from 'react';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace, findWorkspaces, findSubapps} from '@/orm/workspace';
import {DEFAULT_THEME_OPTIONS} from '@/constants/theme';

// ---- LOCAL IMPORTS ---- //
import Workspace from './workspace-context';
import CartContext from './cart-context';
import Header from './header';
import Sidebar from './sidebar';
import MobileMenu from './mobile-menu';

const defaultTheme = {
  id: -1,
  name: 'Default Theme',
  css: JSON.stringify(DEFAULT_THEME_OPTIONS),
};

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
  const user = session?.user;

  const $workspace = await findWorkspace({
    user,
    url: workspaceURL,
  }).then(clone);

  let theme;

  try {
    theme = $workspace?.theme || defaultTheme;
    theme.options = JSON.parse(theme?.css);
  } catch (err: any) {
    console.error(err.message);
  }

  const subapps = await findSubapps({
    url: $workspace?.url,
    user,
  });

  return (
    <Workspace workspace={workspace} tenant={tenant} theme={theme}>
      <CartContext>
        <div className="h-full w-full flex">
          <Sidebar subapps={subapps} workspaces={workspaces} />
          <div className="flex flex-col flex-1 max-h-full max-w-full min-w-0">
            <Header subapps={subapps} user={user} />
            {children}
          </div>
          <MobileMenu subapps={subapps} workspaces={workspaces} />
        </div>
      </CartContext>
    </Workspace>
  );
}
