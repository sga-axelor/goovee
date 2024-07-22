import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/orm/auth';
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findArchivedInvoices} from '@/subapps/invoices/common/orm/invoices';
import {getWhereClause} from '@/subapps/invoices/common/utils/invoices';
import {SUBAPP_CODES} from '@/constants';

export default async function Invoices({
  params,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
}) {
  const session = await getSession();

  if (!session) return notFound();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp({
    code: SUBAPP_CODES.invoices,
    url: workspace.url,
    user: session?.user,
  });

  const {id, isContact, mainPartnerId} = session?.user;

  if (!app?.installed) {
    return notFound();
  }

  const {role} = app;

  const where = getWhereClause(isContact, role, id, mainPartnerId);

  const invoices = await findArchivedInvoices({where});

  return <Content invoices={clone(invoices)} />;
}
