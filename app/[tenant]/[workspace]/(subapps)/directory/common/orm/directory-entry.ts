import {manager} from '@/tenant';

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
      address: {
        zip: true,
        city: {name: true},
        country: {name: true},
        streetName: true,
        latit: true,
        longit: true,
        formattedFullName: true,
      },
      twitter: true,
      website: true,
      isMap: true,
      description: true,
      linkedIn: true,
      image: {id: true},
      directoryContactSet: {
        select: {
          simpleFullName: true,
          emailAddress: {address: true},
          fixedPhone: true,
        },
      },
      instagram: true,
      directoryEntryCategorySet: {select: {title: true, color: true}},
      attrs: true,
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
  orderBy,
}: {
  take?: number;
  skip?: number;
  workspaceId?: string;
  categoryId?: ID;
  tenantId: Tenant['id'];
  orderBy?: Record<string, any>;
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entries = await c.aOSPortalDirectoryEntry.find({
    ...(categoryId && {where: {directoryEntryCategorySet: {id: categoryId}}}),
    orderBy: orderBy as any,
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    select: {
      id: true,
      title: true,
      isMap: true,
      address: {
        zip: true,
        city: {name: true},
        country: {name: true},
        streetName: true,
        formattedFullName: true,
        latit: true,
        longit: true,
      },
      description: true,
      image: {id: true},
      directoryEntryCategorySet: {select: {title: true, color: true}},
    },
  });
  return entries;
}

export type SearchEntry = Expand<
  NonNullable<Awaited<ReturnType<typeof findEntries>>>[number]
>;

export async function findEntriesBySearch({
  workspaceId,
  tenantId,
  categoryId,
  search,
}: {
  workspaceId?: string;
  categoryId?: ID;
  search?: string;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entries = await c.aOSPortalDirectoryEntry.find({
    take: 10,
    where: {
      ...(categoryId && {directoryEntryCategorySet: {id: categoryId}}),
      ...(search && {
        OR: [
          {title: {like: `%${search}%`}},
          {description: {like: `%${search}%`}},
          {address: {formattedFullName: {like: `%${search}%`}}},
          {directoryEntryCategorySet: {title: {like: `%${search}%`}}},
        ],
      }),
    },
    select: {title: true},
  });
  return entries;
}
