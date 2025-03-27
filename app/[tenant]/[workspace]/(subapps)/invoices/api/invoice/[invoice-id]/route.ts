import {NextRequest, NextResponse} from 'next/server';

// ---- CORE IMPORTS ---- //
import {RELATED_MODELS, SUBAPP_CODES} from '@/constants';
import {getSession} from '@/lib/core/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {findLatestDMSFileByName, streamFile} from '@/utils/download';
import {workspacePathname} from '@/utils/workspace';
import {getWhereClauseForEntity} from '@/utils/filters';
import {PartnerKey} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findInvoice} from '@/subapps/invoices/common/orm/invoices';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      tenant: string;
      workspace: string;
      'invoice-id': string;
    };
  },
) {
  const {workspaceURL, tenant: tenantId} = workspacePathname(params);
  const {'invoice-id': invoiceId} = params;

  const session = await getSession();

  const user = session!.user;

  if (!user) {
    return new NextResponse('Unauthorized', {status: 401});
  }

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId,
  });

  if (!workspace) {
    return new NextResponse('Invalid workspace', {status: 401});
  }

  const subapp = await findSubappAccess({
    code: SUBAPP_CODES.invoices,
    user: session?.user,
    url: workspaceURL,
    tenantId,
  });

  if (!subapp) {
    return new NextResponse('Unauthorized', {status: 401});
  }

  const invoicesWhereClause = getWhereClauseForEntity({
    user,
    role: subapp.role,
    isContactAdmin: subapp.isContactAdmin,
    partnerKey: PartnerKey.PARTNER,
  });

  const invoice = await findInvoice({
    id: invoiceId,
    params: {where: invoicesWhereClause},
    workspaceURL,
    tenantId,
  });

  const file = await findLatestDMSFileByName({
    tenant: tenantId,
    user,
    relatedId: invoiceId,
    relatedModel: RELATED_MODELS.INVOICE,
    name: invoice.invoiceId,
  });

  if (!file) {
    return new NextResponse('File not found', {status: 404});
  }

  return streamFile(file);
}
