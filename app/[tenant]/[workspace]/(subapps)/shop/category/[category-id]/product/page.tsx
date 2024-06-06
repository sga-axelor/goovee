import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //I
import {workspacePathname} from '@/utils/workspace';

export default function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {workspaceURI} = workspacePathname(params);

  redirect(`${workspaceURI}/shop`);
}
