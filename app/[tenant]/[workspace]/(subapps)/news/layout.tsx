import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess} from '@/orm/subapps';
import {SUBAPP_CODES} from '@/constants';
import {findWorkspace} from '@/orm/workspace';

// ---- LOCAL IMPORTS ---- //
import MobileMenuCategory from '@/subapps/news/mobile-menu-category';
import {findCategories} from '@/subapps/news/common/orm/news';

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
