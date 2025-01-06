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

export async function getFile({
  orderId,
  workspaceURL,
  modelName,
  subapp,
}: {
  orderId: number;
  workspaceURL: string;
  modelName: string;
  subapp: SUBAPP_CODES;
}) {
  try {
    if (!orderId) {
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

    const workspace = await findWorkspace({user, url: workspaceURL, tenantId});

    if (!workspace) {
      return {error: true, message: await t('Invalid workspace')};
    }

    const {
      error,
      message,
      data: modelRecord,
    }: any = await findByID({
      subapp,
      id: orderId,
      workspaceURL,
      workspace,
      tenantId,
    });

    if (error) {
      return {
        error: true,
        message: await t(message || 'Record not found.'),
      };
    }

    const client = await manager.getClient(tenantId);

    const file = await client.aOSDMSFile
      .findOne({
        where: {
          isDirectory: false,
          relatedId: modelRecord.id,
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
