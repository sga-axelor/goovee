// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {ID, PartnerKey, PortalWorkspace} from '@/types';
import {type Tenant} from '@/tenant';
import {t} from '@/locale/server';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {getWhereClauseForEntity} from '@/utils/filters';

//---- LOCAL SUBAPP SPECIFIC FIND METHODS ---- //
import {findEvent} from '@/app/[tenant]/[workspace]/(subapps)/events/common/orm/event';
import {findPosts} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/orm/forum';
import {findNews} from '@/app/[tenant]/[workspace]/(subapps)/news/common/orm/news';
import {findTicketAccess} from '@/app/[tenant]/[workspace]/(subapps)/ticketing/common/orm/tickets';
import {findOrder} from '@/subapps/orders/common/orm/orders';
import {findQuotation} from '@/subapps/quotations/common/orm/quotations';
import {findInvoice} from '@/subapps/invoices/common/orm/invoices';

export async function findByID({
  subapp,
  id,
  workspace,
  withAuth = true,
  tenantId,
  workspaceURL,
}: {
  subapp: SUBAPP_CODES;
  id: ID;
  workspace: PortalWorkspace;
  withAuth?: boolean;
  workspaceURL: string;
  tenantId: Tenant['id'];
}): Promise<{
  success?: boolean;
  error?: boolean;
  message?: string;
  data?: any;
}> {
  if (!subapp || !id) {
    return {
      error: true,
      message: await t('Missing subapp or ID'),
    };
  }

  if (!workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }

  if (!tenantId) {
    return {
      error: true,
      message: await t('TenantId is required'),
    };
  }

  const session = await getSession();
  const user = session?.user;

  if (withAuth && !user) {
    return {
      error: true,
      message: await t('Unauthorized User'),
    };
  }

  const app = await findSubappAccess({
    code: subapp,
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!app) {
    return {
      error: true,
      message: await t('Unauthorized Access'),
    };
  }

  const $workspace = await findWorkspace({
    user,
    url: workspaceURL,
    tenantId,
  });

  if (!$workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }

  const {role, isContactAdmin} = app;
  let response: any;

  switch (subapp) {
    case SUBAPP_CODES.events:
      response = await findEvent({id, workspace, tenantId, user});
      break;

    case SUBAPP_CODES.news:
      const {news}: any = await findNews({id, workspace, tenantId, user});
      response = news?.[0];
      break;

    case SUBAPP_CODES.forum:
      const {posts = []}: any = await findPosts({
        whereClause: {id},
        workspaceID: workspace.id,
        tenantId,
        user,
      });
      response = posts[0];
      break;

    case SUBAPP_CODES.ticketing:
      if (user) {
        response = await findTicketAccess({
          recordId: id,
          auth: {
            email: user.email,
            userId: user.id,
            simpleFullName: user.simpleFullName,
            workspaceId: workspace.id.toString(),
            workspaceURL: workspaceURL,
            tenantId,
            isContact: user.isContact!,
            isContactAdmin: app.isContactAdmin,
            role,
          },
        });
      }
      break;

    case SUBAPP_CODES.orders:
      if (!user) {
        return {
          error: true,
          message: await t('Unauthorized User'),
        };
      }
      const orderWhereClause = getWhereClauseForEntity({
        user,
        role,
        isContactAdmin,
        partnerKey: PartnerKey.CLIENT_PARTNER,
      });
      response = await findOrder({
        id,
        tenantId,
        workspaceURL,
        params: {where: orderWhereClause},
      });
      break;

    case SUBAPP_CODES.quotations:
      if (!user) {
        return {
          error: true,
          message: await t('Unauthorized User'),
        };
      }
      const quotationWhereClause = getWhereClauseForEntity({
        user,
        role,
        isContactAdmin,
        partnerKey: PartnerKey.CLIENT_PARTNER,
      });
      response = await findQuotation({
        id,
        tenantId,
        params: {where: quotationWhereClause},
        workspaceURL,
      });
      break;

    case SUBAPP_CODES.invoices:
      if (!user) {
        return {
          error: true,
          message: await t('Unauthorized User'),
        };
      }
      const invoiceWhereClause = getWhereClauseForEntity({
        user,
        role,
        isContactAdmin,
        partnerKey: PartnerKey.PARTNER,
      });
      response = await findInvoice({
        id,
        tenantId,
        workspaceURL,
        params: {where: invoiceWhereClause},
      });
      break;
    default:
      return {
        error: true,
        message: await t('Unknown subapp type'),
      };
  }

  if (!response) {
    return {
      error: true,
      message: await t('Record not found: The requested data does not exist.'),
    };
  }

  return {success: true, data: response};
}
