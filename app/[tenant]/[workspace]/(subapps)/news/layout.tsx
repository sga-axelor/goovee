import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {findSubappAccess} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import MobileMenuCategory from '@/subapps/news/mobile-menu-category';
import {findCategories} from '@/subapps/news/common/orm/news';

export const metadata: Metadata = {
  title: i18n.get('News'),
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
  const {tenant} = params;

  const session = await getSession();
  const user = session?.user;
  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.news,
    user,
    url: workspaceURL,
    tenantId: tenant,
  });

  if (!subapp) return notFound();

  const allCategories = await findCategories({
    showAllCategories: true,
    workspace,
    tenantId: tenant,
  }).then(clone);

  return (
    <>
      {children}
      <MobileMenuCategory categories={allCategories} />
    </>
  );
}
