// ---- CORE IMPORTS ---- //
import {manager} from '@/tenant';
import {t} from '@/lib/core/locale/server';
import type {Tenant} from '@/tenant';
import type {ID} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {Category, ListCategory} from '../types';

export async function findCategories({
  workspaceId,
  tenantId,
}: {
  workspaceId?: ID;
  tenantId: Tenant['id'];
}): Promise<ListCategory[]> {
  if (!(workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const directoryCategories = await c.aOSPortalDirectoryCategory.find({
    where: {OR: [{archived: false}, {archived: null}]},
    orderBy: {title: 'ASC'},
    select: {title: true, color: true, icon: true},
  });

  return directoryCategories;
}

export async function findCategory({
  id,
  workspaceId,
  tenantId,
}: {
  id: ID;
  workspaceId?: ID;
  tenantId: Tenant['id'];
}): Promise<Category | null> {
  if (!(workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }

  const c = await manager.getClient(tenantId);

  const directoryCategory = await c.aOSPortalDirectoryCategory.findOne({
    where: {id, OR: [{archived: false}, {archived: null}]},
    select: {
      title: true,
      directoryCategorySet: {
        select: {title: true, color: true, icon: true},
      },
    },
  });

  return directoryCategory;
}
