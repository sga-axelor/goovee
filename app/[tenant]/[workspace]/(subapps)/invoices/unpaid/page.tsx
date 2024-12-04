import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES, DEFAULT_LIMIT} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findUnpaidInvoices} from '@/subapps/invoices/common/orm/invoices';
import {getWhereClause} from '@/subapps/invoices/common/utils/invoices';

export default async function Invoices({
  params,
  searchParams,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
  searchParams: {[key: string]: string | undefined};
}) {
  const {tenant} = params;

  const {limit, page} = searchParams;

  const session = await getSession();

  if (!session) return notFound();

  const user = session?.user;

  if (!user) {
    return notFound();
  }

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

  const {role, isContactAdmin} = app;

  const {invoices, pageInfo}: any = await findUnpaidInvoices({
    params: {
      where: getWhereClause({
        user,
        role,
        isContactAdmin,
      }),
    },
    tenantId: tenant,
    workspaceURL,
    page,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
  });

  return (
    <Content invoices={invoices} workspace={workspace} pageInfo={pageInfo} />
  );
}
