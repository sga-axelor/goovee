import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess} from '@/orm/subapps';
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
  const session = await getSession();
  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.news,
    user: session?.user,
    workspaceURL,
  });

  if (!subapp) return notFound();

  const allCategories = await findCategories({
    showAllCategories: true,
    workspace,
  }).then(clone);

  return (
    <>
      {children}
      <MobileMenuCategory categories={allCategories} />
    </>
  );
}
