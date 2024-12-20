import {manager} from '@/tenant';

import type {ID, PortalWorkspace} from '@/types';
import type {Tenant} from '@/tenant';
import {ORDER_BY} from '@/constants';

export async function findEntryDetailById({
  id,
  workspace,
  tenantId,
}: {
  id: ID;
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(id && workspace && tenantId)) return [];
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
      map: true,
      description: true,
      linkedIn: true,
      image: true,
    },
  });
  return entryDetails;
}

export async function findDirectoryEntryList({
  page,
  limit,
  workspace,
  tenantId,
}: {
  page?: number;
  limit?: number;
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && tenantId)) return [];
  const c = await manager.getClient(tenantId);
  const skip = Number(limit) * Math.max(Number(page) - 1, 0);
  const entryDetailList = await c.aOSPortalDirectoryEntry.find({
    orderBy: {id: ORDER_BY.ASC} as any,
    take: limit,
    ...(skip ? {skip} : {}),
    select: {
      id: true,
      title: true,
      city: true,
      address: true,
      zipcode: true,
      twitter: true,
      website: true,
      map: true,
      description: true,
      linkedIn: true,
      image: true,
    },
  });
  return entryDetailList;
}
