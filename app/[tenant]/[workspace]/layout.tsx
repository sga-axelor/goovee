import React from 'react';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace} from '@/orm/workspace';
import {findSubapps} from '@/orm/subapps';

// ---- LOCAL IMPORTS ---- //
import Workspace from './workspace-context';
import CartContext from './cart-context';
import Header from './header';
import Footer from './footer';

export default async function Layout({
  params,
  children,
}: {
  params: {tenant: string; workspace: string};
  children: React.ReactNode;
}) {
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
    <>
      <Workspace workspace={workspace} tenant={tenant} theme={theme}>
        <CartContext>
          <Header subapps={subapps} />
          {children}
          {/* <Footer /> */}
        </CartContext>
      </Workspace>
    </>
  );
}
