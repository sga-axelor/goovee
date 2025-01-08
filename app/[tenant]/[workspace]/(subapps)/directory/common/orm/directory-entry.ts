import {manager} from '@/tenant';

import {t} from '@/lib/core/locale/server';
import type {Tenant} from '@/tenant';
import type {ID} from '@/types';

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
    throw new Error(await t('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const entry = await c.aOSPortalDirectoryEntry.findOne({
    where: {
      id: id,
      workspace: {
        id: workspaceId,
      },
    },
    select: {
      title: true,
      address: {
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
          mobilePhone: true,
          linkedinLink: true,
          picture: {
            id: true,
          },
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
  workspaceId?: string;
  categoryId?: ID;
  tenantId: Tenant['id'];
  orderBy?: Record<string, any>;
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entries = await c.aOSPortalDirectoryEntry.find({
    ...(categoryId && {
      where: {
        directoryEntryCategorySet: {id: categoryId},
        workspace: {id: workspaceId},
      },
    }),
    orderBy: orderBy as any,
    ...(take ? {take} : {}),
    ...(skip ? {skip} : {}),
    select: {
      id: true,
      title: true,
      isMap: true,
      address: {
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
    throw new Error(await t('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);
  const entries = await c.aOSPortalDirectoryEntry.find({
    take: 10,
    where: {
      ...(categoryId && {
        directoryEntryCategorySet: {id: categoryId},
        workspace: {id: workspaceId},
      }),
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
