// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {ID, PortalWorkspace} from '@/types';
import {type Tenant} from '@/tenant';
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';

//---- LOCAL SUBAPP SPECIFIC FIND METHODS ---- //
import {findEventByID} from '@/app/[tenant]/[workspace]/(subapps)/events/common/orm/event';
import {findPosts} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/orm/forum';
import {findNews} from '@/app/[tenant]/[workspace]/(subapps)/news/common/orm/news';
import {findTicketAccess} from '@/app/[tenant]/[workspace]/(subapps)/ticketing/common/orm/tickets';
import {findOrder} from '@/subapps/orders/common/orm/orders';
import {findQuotation} from '@/subapps/quotations/common/orm/quotations';
import {getWhereClause as getQuotationsWhereClause} from '@/app/[tenant]/[workspace]/(subapps)/quotations/common/utils/quotations';

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
}) {
  if (!subapp || !id) {
    return {
      error: true,
      message: await getTranslation('Missing subapp or ID'),
    };
  }

  if (!workspace) {
    return {
      error: true,
      message: await getTranslation('Invalid workspace'),
    };
  }

  if (!tenantId) {
    return {
      error: true,
      message: await getTranslation('TenantId is required.'),
    };
  }

  const session = await getSession();
  const user = session?.user;
  if (withAuth) {
    if (!user) {
      return {
        error: true,
        message: await getTranslation('Unauthorized'),
      };
    }
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
      message: await getTranslation('Unauthorized'),
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
      message: await getTranslation('Invalid workspace'),
    };
  }

  let response: any;

  switch (subapp) {
    case SUBAPP_CODES.events:
      response = await findEventByID({id, workspace, tenantId, user});
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
            userId: user.id,
            workspaceId: workspace.id.toString(),
            tenantId,
            isContact: user.isContact!,
            role: app.role,
          },
        });
      }
      break;
    case SUBAPP_CODES.orders:
      response = await findOrder({id, tenantId});
      break;
    case SUBAPP_CODES.quotations:
      if (!user) {
        return {
          error: true,
          message: await getTranslation('Unauthorized'),
        };
      }
      const {isContact, id: userID, mainPartnerId} = user;

      const {role} = app;

      const where = getQuotationsWhereClause(
        isContact,
        role,
        userID,
        mainPartnerId,
      );
      response = await findQuotation({
        id,
        tenantId,
        params: {where},
      });
      break;

    default:
      return {
        error: true,
        message: await getTranslation('Unknown type'),
      };
  }

  if (!response)
    return {
      error: true,
      message: await getTranslation(
        'Record not found: The requested data does not exist.',
      ),
    };

  return {success: true, data: response};
}
