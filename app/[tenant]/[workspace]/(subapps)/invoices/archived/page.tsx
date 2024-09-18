import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {getSession} from '@/auth';
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
  const {tenant} = params;

  const session = await getSession();

  if (!session) return notFound();

  const user = session?.user;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp({
    code: SUBAPP_CODES.invoices,
    url: workspace.url,
    user,
    tenantId: tenant,
  });

  if (!app?.installed) {
    return notFound();
  }

  const {id, isContact, mainPartnerId} = user;

  const {role} = app;

  const invoices = await findArchivedInvoices({
    params: {
      where: getWhereClause(isContact, role, id, mainPartnerId),
    },
    tenantId: tenant,
  });

  return <Content invoices={clone(invoices)} />;
}
