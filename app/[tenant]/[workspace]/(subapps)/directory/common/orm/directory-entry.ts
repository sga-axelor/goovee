import {manager} from '@/tenant';

import type {ID, PortalWorkspace} from '@/types';
import type {Tenant} from '@/tenant';
import {ORDER_BY} from '@/constants';
import {getTranslation} from '@/lib/core/i18n/server';

export async function findEntryDetailById({
  id,
  workspace,
  tenantId,
}: {
  id: ID;
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(id && workspace && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const entryDetails = await c.aOSPortalDirectoryEntry.findOne({
    where: {
      id,
    },
    select: {
      title: true,
      city: true,
      address: true,
      zipcode: true,
      twitter: true,
      website: true,
      isMap: true,
      description: true,
      linkedIn: true,
      image: true,
      directoryContactSet: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          linkedinLink: true,
        },
      },
      instagram: true,
      directoryEntryCategorySet: {
        select: {
          title: true,
          color: true,
        },
      },
    },
  });
  return entryDetails;
}

export async function findDirectoryEntryList({
  take,
  skip,
  workspace,
  tenantId,
}: {
  take?: number;
  skip?: number;
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entryDetailList = await c.aOSPortalDirectoryEntry.find({
    orderBy: {id: ORDER_BY.ASC} as any,
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    select: {
      id: true,
      title: true,
      city: true,
      address: true,
      zipcode: true,
      isMap: true,
      description: true,
      image: true,
      directoryEntryCategorySet: {
        select: {
          title: true,
          color: true,
        },
      },
    },
  });
  return entryDetailList;
}
