'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ----//
import {t} from '@/locale/server';
import {TENANT_HEADER} from '@/middleware';
import {getSession} from '@/auth';
import {findSubappAccess, findWorkspace} from '@/orm/workspace';
import {SUBAPP_CODES, INVOICE_ENTITY_TYPE} from '@/constants';
import {findByID} from '@/orm/record';
import {getWhereClauseForEntity} from '@/utils/filters';
import {PartnerKey} from '@/types';
import {findFile} from '@/orm/file';

// ---- LOCAL IMPORTS ----//
import {
  findCustomerDelivery,
  findInvoice,
} from '@/subapps/orders/common/orm/orders';

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
        message: await t('Id is missing!'),
      };
    }

    if (!workspaceURL) {
      return {
        error: true,
        message: await t('Invalid workspace'),
        data: null,
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

    const workspace = await findWorkspace({user, url: workspaceURL, tenantId});
    if (!workspace) {
      return {error: true, message: await t('Invalid workspace')};
    }

    let record: any;
    record = await fetchRecordByType({
      type,
      id,
      subapp,
      workspaceURL,
      workspace,
      tenantId,
      user,
    });
    if (record.error) {
      return {
        error: true,
        message: await t(record.message || 'Record not found.'),
      };
    }

    const fileName = generateFileName({type, record});

    const file = await findFile({
      tenantId,
      user,
      relatedId: record?.data.id,
      relatedModel: modelName,
      fileName,
    });
    return file;
  } catch (error) {
    console.error('Error in getFile:', error);
    return {
      error: true,
      message: await t('An unexpected error occurred'),
    };
  }
}

async function fetchRecordByType({
  type,
  id,
  subapp,
  workspaceURL,
  workspace,
  tenantId,
  user,
}: any) {
  const appAccess = await findSubappAccess({
    code: subapp,
    user,
    url: workspaceURL,
    tenantId,
  });
  if (!appAccess) {
    return {
      error: true,
      message: await t('Unauthorized App access.'),
    };
  }

  const {role, isContactAdmin} = appAccess;

  switch (type) {
    case INVOICE_ENTITY_TYPE.ORDER:
      return await findByID({subapp, id, workspaceURL, workspace, tenantId});
    case INVOICE_ENTITY_TYPE.INVOICE:
      const invoiceWhereClause = getWhereClauseForEntity({
        user,
        role,
        isContactAdmin,
        partnerKey: PartnerKey.PARTNER,
      });
      return await findInvoice({
        id,
        tenantId,
        workspaceURL,
        params: {where: invoiceWhereClause},
      });
    case INVOICE_ENTITY_TYPE.CUSTOMER_DELIVERY:
      return await findCustomerDelivery({id, tenantId, workspaceURL});
    default:
      return {error: true, message: await t('Invalid invoice type')};
  }
}

function generateFileName({type, record}: any) {
  switch (type) {
    case INVOICE_ENTITY_TYPE.CUSTOMER_DELIVERY:
      return record?.data?.stockMoveSeq || '';
    case INVOICE_ENTITY_TYPE.INVOICE:
      return record?.data?.invoiceId || '';
    case INVOICE_ENTITY_TYPE.ORDER:
      return record?.data?.saleOrderSeq || '';
    default:
      return '';
  }
}
