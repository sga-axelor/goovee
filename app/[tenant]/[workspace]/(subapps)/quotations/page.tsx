import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/orm/auth';
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {clone} from '@/utils';
import {DEFAULT_LIMIT, SUBAPP_CODES} from '@/constants';
import type {User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {fetchQuotations} from '@/subapps/quotations/common/orm/quotations';
import {getWhereClause} from '@/subapps/quotations/common/utils/quotations';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {[key: string]: string | undefined};
}) {
  const {tenant} = params;
  const session = await getSession();
  const {limit, page} = searchParams;

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) return notFound();

  const app = await findSubapp({
    code: SUBAPP_CODES.quotations,
    url: workspace.url,
    user: session?.user,
    tenantId: tenant,
  });

  if (!app?.installed) {
    return notFound();
  }

  const {isContact, id, mainPartnerId} = session?.user as User;
  const {role} = app;

  const where = getWhereClause(isContact, role, id, mainPartnerId);

  const {quotations, pageInfo} = await fetchQuotations({
    page: page || 1,
    limit: limit ? Number(limit) : DEFAULT_LIMIT,
    partnerId: id,
    where,
    tenantId: tenant,
  });

  return <Content quotations={clone(quotations)} pageInfo={pageInfo} />;
}
