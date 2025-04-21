import {notFound, redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {findAllWebsites} from '@/subapps/website/common/orm/website';
import {NotFound} from '@/subapps/website/common/ui/components';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {tenant} = params;

  const {workspaceURL} = workspacePathname(params);

  const session = await getSession();

  const user = session?.user;

  const websites = await findAllWebsites({
    workspaceURL,
    user,
    tenantId: tenant,
  });

  if (websites?.length) {
    const website = websites.find(w => w.slug);

    if (website) {
      redirect(`${workspaceURL}/${SUBAPP_CODES.website}/${website.slug}`);
    }
  }

  return <NotFound />;
}
