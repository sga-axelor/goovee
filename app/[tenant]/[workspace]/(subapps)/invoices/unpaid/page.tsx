import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {SUBAPP_CODES, DEFAULT_LIMIT} from '@/constants';
import {getWhereClauseForEntity} from '@/utils/filters';
import {PartnerKey} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {findUnpaidInvoices} from '@/subapps/invoices/common/orm/invoices';

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

  const invoicesWhereClause = getWhereClauseForEntity({
    user,
    role,
    isContactAdmin,
    partnerKey: PartnerKey.PARTNER,
  });

  const result: any = await findUnpaidInvoices({
    params: {
      where: invoicesWhereClause,
      page,
      limit: limit ? Number(limit) : DEFAULT_LIMIT,
    },
    tenantId: tenant,
    workspaceURL,
  });

  if (!result) {
    return notFound();
  }

  const {invoices, pageInfo} = result;

  return (
    <Content invoices={invoices} workspace={workspace} pageInfo={pageInfo} />
  );
}
