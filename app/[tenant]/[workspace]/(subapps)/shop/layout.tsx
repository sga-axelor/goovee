import React from 'react';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {clone} from '@/utils';
import {i18n} from '@/lib/i18n';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import MobileMenuCategory from './mobile-menu-category';
import {findCategories} from './common/orm/categories';

export const metadata: Metadata = {
  title: i18n.get('Shop'),
};

export default async function Layout({
  params,
  children,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
  children: React.ReactNode;
}) {
  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp({
    code: SUBAPP_CODES.shop,
    url: workspace.url,
    user: session?.user,
  });

  if (!app?.installed) {
    return notFound();
  }

  const categories = await findCategories({workspace}).then(clone);
  const parentcategories = categories?.filter((c: any) => !c.parent);

  return (
    <>
      {children}
      <MobileMenuCategory categories={parentcategories} />
    </>
  );
}
