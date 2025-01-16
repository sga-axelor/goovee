import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {workspacePathname} from '@/utils/workspace';
import {getSession} from '@/auth';
import {findWorkspace, findSubapp} from '@/orm/workspace';
import {clone} from '@/utils';
import {DEFAULT_LIMIT, DEFAULT_PAGE, SUBAPP_CODES} from '@/constants';
import {PartnerKey, type User} from '@/types';
import {getWhereClauseForEntity} from '@/utils/filters';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {fetchQuotations} from '@/subapps/quotations/common/orm/quotations';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {[key: string]: string | undefined};
}) {
  const {tenant} = params;
  const session = await getSession();

  const user = session?.user as User;

  if (!user) {
    return notFound();
  }

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

  const {role, isContactAdmin} = app;

  const where = getWhereClauseForEntity({
    user,
    role,
    isContactAdmin,
    partnerKey: PartnerKey.CLIENT_PARTNER,
  });

  const result: any = await fetchQuotations({
    params: {
      where,
      page: page || DEFAULT_PAGE,
      limit: limit ? Number(limit) : DEFAULT_LIMIT,
    },
    tenantId: tenant,
    workspaceURL,
  });

  if (!result) {
    return notFound();
  }

  const {quotations, pageInfo} = result;

  return <Content quotations={clone(quotations)} pageInfo={pageInfo} />;
}
