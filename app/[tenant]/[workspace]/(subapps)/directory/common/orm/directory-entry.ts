import {manager} from '@/tenant';

import {ORDER_BY} from '@/constants';
import {getTranslation} from '@/lib/core/i18n/server';
import type {Tenant} from '@/tenant';
import type {ID} from '@/types';

export async function findEntryDetailById({
  id,
  workspaceId,
  tenantId,
}: {
  id: ID;
  workspaceId?: string;
  tenantId: Tenant['id'];
}) {
  if (!(id && workspaceId && tenantId)) {
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
  workspaceId,
  tenantId,
}: {
  take?: number;
  skip?: number;
  workspaceId?: string;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceId && tenantId)) {
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
