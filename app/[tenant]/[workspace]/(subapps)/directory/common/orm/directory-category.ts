// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';

import type {PortalWorkspace} from '@/types';
import type {Tenant} from '@/tenant';

export async function findDirectoryCategories({
  workspace,
  tenantId,
}: {
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const directoryCategories = await c.aOSPortalDirectoryCategory.find({
    select: {
      title: true,
      color: true,
    },
  });
  return directoryCategories;
}

export async function findDirectoryEntries({
  workspace,
  tenantId,
}: {
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && tenantId)) return [];

  const c = await manager.getClient(tenantId);

  const directoryEntries = await c.aOSPortalDirectoryEntry.find({
    select: {
      title: true,
      address: true,
      description: true,
    },
  });
  return directoryEntries;
}

export async function findDirectoryEntry({
  workspace,
  tenantId,
  id,
}: {
  workspace?: PortalWorkspace;
  tenantId: Tenant['id'];
  id: string;
}) {
  if (!(workspace && tenantId)) return {};

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
