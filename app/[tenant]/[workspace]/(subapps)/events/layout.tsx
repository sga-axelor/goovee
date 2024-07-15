import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {workspacePathname} from '@/utils/workspace';
import {findSubappAccess} from '@/orm/subapps';
import {SUBAPP_CODES} from '@/constants';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {findEventCategories} from '@/subapps/events/common/orm/event-category';
import {MobileMenuCategory} from '@/subapps/events/common/ui/components';

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

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.events,
    user: session?.user,
    workspaceURL,
  });

  if (!subapp) return notFound();

  const categories = await findEventCategories().then(clone);

  return (
    <>
      {children}
      <MobileMenuCategory categories={categories} />
    </>
  );
}
