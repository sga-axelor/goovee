// ---- CORE IMPORTS ----//
import {manager, type Tenant} from '@/tenant';
import {clone} from '@/utils';
import type {ID} from '@/types';

export async function findAll({
  localization,
  tenantId,
}: {
  localization?: string;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const templates = await client.aOSMessageTemplate
    .find({
      where: {
        ...(localization
          ? {
              localizationSet: {
                code: {
                  like: localization,
                },
              },
            }
          : {}),
      },
    })
    .then(clone);

  return templates;
}

export async function findOneById({
  id,
  tenantId,
}: {
  id: ID;
  tenantId: Tenant['id'];
}) {
  if (!(id && tenantId)) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const templates = await client.aOSMessageTemplate
    .findOne({
      where: {
        id,
      },
    })
    .then(clone);

  return templates;
}

export function replacePlaceholders({
  content,
  values,
}: {
  content: string;
  values: any;
}) {
  if (!(content && values)) return;

  return content.replace(/\$\w+(\.\w+)*\$/g, (placeholder: string) => {
    const key = placeholder.slice(1, -1);
    return values[key] || placeholder;
  });
}
