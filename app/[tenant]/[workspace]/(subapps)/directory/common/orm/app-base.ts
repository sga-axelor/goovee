import {t} from '@/lib/core/locale/server';
import {manager, type Tenant} from '@/lib/core/tenant';
import type {ID} from '@/types';

import {MAP_SELECT} from '../constants';
import type {MapConfig} from '../types';

export async function findMapConfig({
  workspaceId,
  tenantId,
}: {
  workspaceId?: ID;
  tenantId: Tenant['id'];
}): Promise<MapConfig> {
  if (!(workspaceId && tenantId)) {
    throw new Error(await t('Missing required parameters'));
  }
  const c = await manager.getClient(tenantId);

  const mapConfig = await c.aOSAppBase.findOne({
    select: {
      mapApiSelect: true,
      googleMapsApiKey: true,
    },
  });

  if (mapConfig?.mapApiSelect === MAP_SELECT.GoogleMaps) {
    return {map: MAP_SELECT.GoogleMaps, apiKey: mapConfig.googleMapsApiKey};
  }

  return {map: MAP_SELECT.OpenStreetMap};
}
