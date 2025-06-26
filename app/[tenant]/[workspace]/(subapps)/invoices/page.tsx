import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';

export default function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {workspaceURL} = workspacePathname(params);

  return redirect(
    `${workspaceURL}/${SUBAPP_CODES.invoices}/${SUBAPP_PAGE.unpaid}`,
  );
}
