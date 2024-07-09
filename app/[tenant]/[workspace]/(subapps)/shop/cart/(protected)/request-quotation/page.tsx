import {redirect} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findSubappAccess} from '@/orm/subapps';
import {SUBAPP_CODES} from '@/constants';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();

  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace?.config?.requestQuotation) {
    redirect(`${workspaceURI}/shop/cart`);
  }

  const quotationSubapp = await findSubappAccess({
    code: SUBAPP_CODES.quotations,
    user: session?.user,
    workspaceURL,
  });

  return (
    <Content workspace={workspace} quotationSubapp={Boolean(quotationSubapp)} />
  );
}
