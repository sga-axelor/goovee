import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {ROUTES} from './common/constants';

export default function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {workspaceURL} = workspacePathname(params);

  redirect(`${workspaceURL}/account/${ROUTES.personal}`);
}
