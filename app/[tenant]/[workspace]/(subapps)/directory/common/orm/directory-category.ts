// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';

import {getTranslation} from '@/lib/core/i18n/server';
import type {Tenant} from '@/tenant';
import type {ID} from '@/types';
import {Expand} from '@/types/util';

export type ListCategory = Expand<
  NonNullable<Awaited<ReturnType<typeof findCategories>>>[number]
>;
export async function findCategories({
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
    select: {title: true, color: true, icon: true},
  });

  return directoryCategories;
}

export type Category = Expand<
  NonNullable<Awaited<ReturnType<typeof findCategory>>>
>;
export async function findCategory({
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

  const directoryCategory = await c.aOSPortalDirectoryCategory.findOne({
    where: {id},
    select: {
      title: true,
      directoryCategorySet: {
        select: {title: true, color: true, icon: true},
      },
    },
  });

  return directoryCategory;
}
