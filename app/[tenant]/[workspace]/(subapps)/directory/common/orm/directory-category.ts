// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';

import {getTranslation} from '@/lib/core/i18n/server';
import type {Tenant} from '@/tenant';
import type {ID} from '@/types';

export async function findDirectoryCategories({
  workspaceId,
  tenantId,
}: {
  workspaceId?: string;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const directoryCategories = await c.aOSPortalDirectoryCategory.find({
    select: {
      title: true,
      color: true,
      icon: true,
      directoryCategorySet: {
        select: {
          title: true,
          color: true,
        },
      },
    },
  });
  return directoryCategories;
}

export async function findDirectoryEntry({
  workspaceId,
  tenantId,
  id,
}: {
  workspaceId?: string;
  tenantId: Tenant['id'];
  id: string;
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const directoryEntry = await c.aOSPortalDirectoryEntry.findOne({
    where: {
      id,
    },
    select: {
      title: true,
      address: true,
      description: true,
    },
  });
  return directoryEntry;
}

export async function findDirectorySubCategoriesById({
  id,
  workspaceId,
  tenantId,
}: {
  id: ID;
  workspaceId?: string;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const directoryCategories = await c.aOSPortalDirectoryCategory.findOne({
    where: {
      id,
    },
    select: {
      directoryCategorySet: {
        select: {
          title: true,
          color: true,
        },
      },
    },
  });

  return directoryCategories?.directoryCategorySet ?? [];
}

export async function findDirectoryEntriesByCategoryId({
  id,
  workspaceId,
  tenantId,
}: {
  id: ID;
  workspaceId?: string;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);
  const directoryEntries = await c.aOSPortalDirectoryEntry.find({
    where: {
      directoryEntryCategorySet: {
        id: id,
      },
    },
    select: {
      id: true,
      title: true,
      city: true,
      address: true,
      zipcode: true,
      isMap: true,
      description: true,
      directoryEntryCategorySet: {
        select: {
          title: true,
          color: true,
        },
      },
    },
  });
  return directoryEntries;
}

export async function findCategoryName({
  id,
  workspaceId,
  tenantId,
}: {
  id?: ID;
  workspaceId?: string;
  tenantId: Tenant['id'];
}) {
  if (!(workspaceId && tenantId)) {
    throw new Error(await getTranslation('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const directoryCategories = await c.aOSPortalDirectoryCategory.findOne({
    where: {
      id: id,
    },
    select: {
      title: true,
    },
  });
  return directoryCategories;
}
