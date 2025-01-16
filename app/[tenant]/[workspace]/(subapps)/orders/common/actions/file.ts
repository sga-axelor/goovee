'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {t} from '@/locale/server';
import {manager} from '@/tenant';
import {TENANT_HEADER} from '@/middleware';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {SUBAPP_CODES} from '@/constants';
import {filterPrivate} from '@/orm/filter';
import {clone} from '@/utils';
import {findByID} from '@/orm/record';
import {getWhereClauseForEntity} from '@/utils/filters';

// ---- LOCAL IMPORTS ----//
import {INVOICE_TYPE} from '@/subapps/orders/common/constants/orders';
import {
  findCustomerDelivery,
  findInvoice,
} from '@/subapps/orders/common/orm/orders';
import {PartnerKey} from '@/types';

export async function getFile({
  id,
  workspaceURL,
  modelName,
  subapp,
  type,
}: {
  id: number;
  workspaceURL: string;
  modelName: string;
  subapp: SUBAPP_CODES;
  type: string;
}) {
  try {
    if (!id) {
      return {
        error: true,
        message: await t('Order Id is missing!'),
      };
    }

    const tenantId = headers().get(TENANT_HEADER);
    if (!tenantId) {
      return {
        error: true,
        message: await t('TenantId is required'),
      };
    }

    const session = await getSession();
    const user = session?.user;
    if (!user) {
      return {error: true, message: await t('Unauthorized user.')};
    }

    const appAcess = await findSubappAccess({
      code: SUBAPP_CODES.orders,
      user,
      url: workspaceURL,
      tenantId,
    });

    if (!appAcess) {
      return {
        error: true,
        message: await t('Unauthorized App access.'),
      };
    }

    const {role, isContactAdmin} = appAcess;

    const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

    if (!workspace) {
      return {error: true, message: await t('Invalid workspace')};
    }

    let record;
    switch (type) {
      case INVOICE_TYPE.order:
        record = await findByID({
          subapp,
          id,
          workspaceURL,
          workspace,
          tenantId,
        });

        if (record.error) {
          return {
            error: true,
            message: await t(record.message || 'Record not found.'),
          };
        }
        break;
      case INVOICE_TYPE.invoice:
        const invoiceWhereClause = getWhereClauseForEntity({
          user,
          role,
          isContactAdmin,
          partnerKey: PartnerKey.PARTNER,
        });
        record = await findInvoice({
          id,
          tenantId,
          workspaceURL,
          params: {where: invoiceWhereClause},
        });

        break;
      case INVOICE_TYPE.customers_delivery:
        record = await findCustomerDelivery({
          id,
          tenantId,
          workspaceURL,
        });
        break;

      default:
        return {
          error: true,
          message: await t('An unexpected error occurred'),
        };
    }

    const client = await manager.getClient(tenantId);

    const file = await client.aOSDMSFile
      .findOne({
        where: {
          isDirectory: false,
          relatedId: record?.data.id,
          relatedModel: modelName,
          parent: {
            relatedModel: modelName,
          },
          ...(await filterPrivate({
            tenantId,
            user,
          })),
        },
        select: {
          fileName: true,
          createdBy: true,
          createdOn: true,
          metaFile: true,
        },
      })
      .then(clone);
    return file;
  } catch (error) {
    console.error('Error in getFile:', error);
    return {
      error: true,
      message: await t('An unexpected error occurred'),
    };
  }
}
