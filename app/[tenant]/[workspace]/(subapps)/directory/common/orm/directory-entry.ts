import {manager} from '@/tenant';

import {ORDER_BY} from '@/constants';
import {getTranslation} from '@/lib/core/i18n/server';
import type {Tenant} from '@/tenant';
import type {ID} from '@/types';
import {Expand} from '@/types/util';

export type Entry = Expand<NonNullable<Awaited<ReturnType<typeof findEntry>>>>;
export async function findEntry({
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

  const entry = await c.aOSPortalDirectoryEntry.findOne({
    where: {id},
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
      directoryEntryCategorySet: {select: {title: true, color: true}},
    },
  });
  return entry;
}

export type ListEntry = Expand<
  NonNullable<Awaited<ReturnType<typeof findEntries>>>[number]
>;
export async function findEntries({
  take,
  skip,
  workspaceId,
  tenantId,
  categoryId,
}: {
  take?: number;
  skip?: number;
  workspaceId?: string;
  categoryId?: ID;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entries = await c.aOSPortalDirectoryEntry.find({
    ...(categoryId && {where: {directoryEntryCategorySet: {id: categoryId}}}),
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
      directoryEntryCategorySet: {select: {title: true, color: true}},
    },
  });
  return entries;
}
