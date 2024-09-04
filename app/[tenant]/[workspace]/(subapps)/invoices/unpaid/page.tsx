import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findUnpaidInvoices} from '@/subapps/invoices/common/orm/invoices';
import {getWhereClause} from '@/subapps/invoices/common/utils/invoices';

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
    url: workspaceURL,
    user,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp({
    code: SUBAPP_CODES.invoices,
    url: workspace.url,
    user: user,
    tenantId: tenant,
  });

  if (!app?.installed) {
    return notFound();
  }

  const {id, isContact, mainPartnerId} = user;

  const {role} = app;

  const invoices = await findUnpaidInvoices({
    params: {
      where: getWhereClause(isContact, role, id, mainPartnerId),
    },
    tenantId: tenant,
  });

  return <Content invoices={clone(invoices)} workspace={workspace} />;
}
