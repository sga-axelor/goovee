import {manager} from '@/tenant';
import {t} from '@/lib/core/locale/server';
import type {Tenant} from '@/tenant';
import type {ID} from '@/types';
import type {OrderByOptions} from '@goovee/orm';
import type {AOSPortalDirectoryEntry} from '@/goovee/.generated/models';

import type {Entry, SearchEntry} from '../types';

export async function findEntryImage({
  id,
  workspaceId,
  tenantId,
}: {
  id: ID;
  workspaceId?: ID;
  tenantId: Tenant['id'];
}): Promise<string | undefined> {
  if (!(id && workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const entry = await c.aOSPortalDirectoryEntry.findOne({
    where: {id, workspace: {id: workspaceId}},
    select: {image: {id: true}},
  });
  return entry?.image?.id;
}

export async function findEntry({
  id,
  workspaceId,
  tenantId,
}: {
  id: ID;
  workspaceId?: ID;
  tenantId: Tenant['id'];
}): Promise<Entry | null> {
  if (!(id && workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const entry = await c.aOSPortalDirectoryEntry.findOne({
    where: {id: id, workspace: {id: workspaceId}},
    select: {
      title: true,
      address: {latit: true, longit: true, formattedFullName: true},
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
          mobilePhone: true,
          linkedinLink: true,
          picture: {id: true},
        },
      },
      instagram: true,
      directoryEntryCategorySet: {select: {title: true, color: true}},
      attrs: true,
    },
  });
  return entry;
}

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
  workspaceId?: ID;
  categoryId?: ID;
  tenantId: Tenant['id'];
  orderBy?: OrderByOptions<AOSPortalDirectoryEntry>;
}): Promise<Entry[]> {
  if (!(workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entries = await c.aOSPortalDirectoryEntry.find({
    where: {
      workspace: {id: workspaceId},
      ...(categoryId && {directoryEntryCategorySet: {id: categoryId}}),
    },
    orderBy,
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    select: {
      id: true,
      title: true,
      isMap: true,
      address: {formattedFullName: true, latit: true, longit: true},
      description: true,
      image: {id: true},
      directoryEntryCategorySet: {select: {title: true, color: true}},
    },
  });
  return entries;
}

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
}): Promise<SearchEntry[]> {
  if (!(workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entries = await c.aOSPortalDirectoryEntry.find({
    take: 10,
    where: {
      workspace: {id: workspaceId},
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
