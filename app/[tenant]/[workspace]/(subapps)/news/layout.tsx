import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ----//
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess} from '@/orm/subapps';
import {SUBAPP_CODES} from '@/constants';

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
  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.news,
    user: (await getSession())?.user,
    workspaceURL: workspacePathname(params)?.workspaceURL,
  });

  if (!subapp) return notFound();

  const allCategories = await findCategories({
    showAllCategories: true,
  }).then(clone);

  return (
    <>
      {children}
      <MobileMenuCategory categories={allCategories} />
    </>
  );
}
